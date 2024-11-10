using OtpNet;
using BusinessLogic.Interfaces;

namespace BusinessLogic.Services
{
    public class TwoFactorAuthService : ITwoFactorAuthService
    {
        public string GenerateSecretKey()
        {
            // Genera una clave secreta de 20 bytes en formato Base32
            var key = KeyGeneration.GenerateRandomKey(20); // Genera 20 bytes aleatorios
            return Base32Encoding.ToString(key); // Convierte a Base32
        }

        public bool Validate2FACode(string secretKey, string code)
        {
            // Decodifica la clave secreta de Base32
            var key = Base32Encoding.ToBytes(secretKey);
            var totp = new Totp(key); // Crea el objeto TOTP con la clave

            // Valida el código proporcionado
            return totp.VerifyTotp(code, out long _);
        }
    }
}