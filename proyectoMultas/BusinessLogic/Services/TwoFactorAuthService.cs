using BusinessLogic.Interfaces;
using DataAccess.EF;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OtpNet;
using System.Drawing;
using System.Drawing.Imaging;
using ZXing;
using ZXing.Common;
using ZXing.Rendering;


public class TwoFactorAuthService : ITwoFactorAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly PasswordHasher<IdentityUser> _passwordHasher;


    public TwoFactorAuthService(AppDbContext dbContext, UserManager<IdentityUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _passwordHasher = new PasswordHasher<IdentityUser>();
    }

    public TwoFactorAuthService()
    {
    }

    public async Task<ServiceResult> EnableTwoFactorAsync(string email, string password)
    {
        var identityUser = await _userManager.FindByEmailAsync(email);
        if (identityUser == null || !ValidatePassword(password, identityUser.PasswordHash))
            return new ServiceResult(false, "Email o Contraseña incorrectos.");

        var user = await _dbContext.Usuarios.FirstOrDefaultAsync(u => u.Correo == email);
        if (user == null)
            return new ServiceResult(false, "Usuario no encontrado.");

        var secretKey = GenerateSecretKey();
        user.TwoFactorSecretKey = secretKey;

        user.IsTwoFactorEnabled = true;
        await _dbContext.SaveChangesAsync();

        var totpUri = GenerateTotpUri(secretKey, email);
        var qrCodeBase64 = GenerateQrCode(totpUri);

        return new ServiceResult(true, "2FA Habilitado correctamente.", qrCodeBase64);
    }

    public async Task<ServiceResult> DisableTwoFactorAsync(string email, string password)
    {
        var identityUser = await _userManager.FindByEmailAsync(email);
        if (identityUser == null || !ValidatePassword(password, identityUser.PasswordHash))
            return new ServiceResult(false, "Email o Contraseña incorrectos.");

        var user = await _dbContext.Usuarios.FirstOrDefaultAsync(u => u.Correo == email);
        if (user == null)
            return new ServiceResult(false, "Usuario no encontrado.");

        user.TwoFactorSecretKey = null;
        user.IsTwoFactorEnabled = false;
        await _dbContext.SaveChangesAsync();

        return new ServiceResult(true, "2FA deshabilitado exitosamente.");
    }

    private string GenerateSecretKey()
    {
        var secretKey = KeyGeneration.GenerateRandomKey(20);
        return Base32Encoding.ToString(secretKey);
    }

    private string GenerateTotpUri(string secretKey, string email)
    {
        string appName = "Tránsito 360";
        return $"otpauth://totp/{appName}:{email}?secret={secretKey}&issuer={appName}";
    }

    private string GenerateQrCode(string totpUri)
    {
        var barcodeWriter = new BarcodeWriter
        {
            Format = BarcodeFormat.QR_CODE,
            Options = new ZXing.Common.EncodingOptions
            {
                Width = 300,
                Height = 300,
                Margin = 1
            }
        };

        using var qrCodeImage = barcodeWriter.Write(totpUri);
        using var memoryStream = new MemoryStream();
        qrCodeImage.Save(memoryStream, ImageFormat.Png);
        return Convert.ToBase64String(memoryStream.ToArray());
    }

    private bool ValidatePassword(string password, string storedHash)
    {
        var identityUser = new IdentityUser();
        var result = _passwordHasher.VerifyHashedPassword(identityUser, storedHash, password);

        return result == PasswordVerificationResult.Success;

    }

    public bool ValidateTwoFactorCode(string email, string totpCode)
    {
        var user = _dbContext.Usuarios.FirstOrDefault(u => u.Correo == email);
        if (user == null || !user.IsTwoFactorEnabled)
        {
            return false;
        }

        var secretKey = user.TwoFactorSecretKey;
        if (string.IsNullOrEmpty(secretKey))
        {
            return false;
        }

        var secretBytes = Base32Encoding.ToBytes(secretKey);

        var totp = new Totp(secretBytes);

        var isValid = totp.VerifyTotp(totpCode, out long timeStepMatched, new VerificationWindow(1, 1));

        return isValid;
    }

}
