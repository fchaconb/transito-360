using DataAccess.EF.Models;
using DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BusinessLogic;
using DataAccess.EF;
using OtpNet;
using BusinessLogic.Interfaces;
using Microsoft.EntityFrameworkCore;
using BusinessLogic.Services;
using System.Net.Mail;
using MimeKit;
using System.Net;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext contexto;
        private readonly ITwoFactorAuthService _twoFactorAuthService;
        private readonly IQrCodeService _qrCodeService;

        public AuthController(
         UserManager<IdentityUser> userManager,
         IConfiguration configuration,
         AppDbContext context,
         ITwoFactorAuthService twoFactorAuthService = null,
        IQrCodeService qrCodeService = null)
        {
            _userManager = userManager;
            _configuration = configuration;
            contexto = context;
            _twoFactorAuthService = twoFactorAuthService ?? new TwoFactorAuthService();
            _qrCodeService = qrCodeService ?? new QrCodeService();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDTO userData)
        {
            var user = await _userManager.FindByNameAsync(userData.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, userData.Password))
            {
                var UsuarioManager = new UsuariosManager(contexto);
                var usuario = await UsuarioManager.GetUsuarioByEmail(userData.UserName);

                var token = await GenerateJwtToken(user);
                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault();
                var userId = usuario.Id;

                return Ok(new { token, role, userId });
            }
            return Unauthorized();
        }

        private async Task<string> GenerateJwtToken(IdentityUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);  // Retrieve the roles for the user
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Add role claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:DurationInMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] LogUpDTO newUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new AppUser
            {
                Email = newUser.Email,
                UserName = newUser.Email,
            };

            var createdUserResult = await _userManager.CreateAsync(user, newUser.Password);

            if (createdUserResult.Succeeded)
            {

                var usuario = new Usuario
                {
                    Cedula = newUser.Cedula,
                    Nombre = newUser.Nombre,
                    Apellido = newUser.Apellido,
                    Correo = newUser.Email,
                    Telefono = newUser.Telefono,
                    fotoCedula = newUser.fotoCedula,
                    fotoPerfil = newUser.fotoPerfil,
                    IdRol = newUser.IdRol,
                    Placas = newUser.Placas
                };

                var roleOfNewUser = await contexto.Roles.FindAsync(newUser.IdRol);
                await _userManager.AddToRoleAsync(user, roleOfNewUser.Nombre);

                var usuariosManager = new UsuariosManager(contexto);

                var usuarioNuevo = await usuariosManager.CrearUsuario(usuario);
                if (usuarioNuevo != null)
                {
                    return Created("Usuario creado exitosamente", null);
                }
                else
                {
                    return BadRequest("Error al crear el usuario en la base de datos.");
                }
            }

            foreach (var error in createdUserResult.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        public async Task<bool> RoleTesting(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                // El usuario no existe
                return false;
            }

            var result = await _userManager.IsInRoleAsync(user, "Admin");
            return result;
        }

        [HttpGet]
        public async Task<IActionResult> MakeAdmin(string userName)
        {
            // Buscar al usuario por su nombre de usuario
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound("Usuario no encontrado");
            }

            // Agregar el rol 'Admin' al usuario
            var result = await _userManager.AddToRoleAsync(user, "Admin");

            if (result.Succeeded)
            {
                return Ok("Usuario agregado al rol de Admin con éxito");
            }

            // Si hubo algún error al agregar el rol
            return BadRequest("No se pudo agregar el rol de Admin al usuario");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            // Find the user by their username
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Delete the user
            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return Ok("User deleted successfully");
            }

            // If there were any errors during the deletion process
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        // PUT: Update user password
        [HttpPut]
        public async Task<IActionResult> UpdatePassword(string email, string newPassword)
        {
            // Find the user by their username
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return NotFound("Usuario no encontrado");
            }

            // Update the user's password
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (result.Succeeded)
            {
                return Ok("Contraseña actualizada con éxito");
            }

            // If there were any errors during the password update process
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return BadRequest("El usuario proporcionado no existe");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var removeResult = await _userManager.RemovePasswordAsync(user);

            if (removeResult.Succeeded)
            {
                var randomPassword = new PasswordGenerator().GeneratePassword(12);

                var addPasswordResult = await _userManager.AddPasswordAsync(user, randomPassword);

                if (addPasswordResult.Succeeded)
                {
                    Console.WriteLine("Password reset successful.");

                    //var scheme = Request?.Scheme ?? "http"; //
                    //var host = Request?.Host.Value ?? "localhost:3000";
                    var scheme = "http";
                    var host = "localhost:3000";

                    var resetUrl = $"{scheme}://{host}/login";

                    var emailSent = await SendPasswordResetEmail(user.Email, resetUrl, randomPassword);

                    if (emailSent)
                    {
                        return Ok("Enlace para recuperar contraseña ha sido enviado");
                    }
                }
                else
                {
                    foreach (var error in addPasswordResult.Errors)
                    {
                        Console.WriteLine(error.Description);
                    }
                }
            }
            else
            {
                foreach (var error in removeResult.Errors)
                {
                    Console.WriteLine(error.Description);
                }
            }



            return StatusCode(500, "There was an error sending the reset email.");
        }


        private async Task<bool> SendPasswordResetEmail(string toEmail, string resetUrl, string randomPass)
        {
            try
            {
                var correo = new MailMessage
                {
                    From = new MailAddress("carolina.residenciadevida@gmail.com"),
                    Subject = "Solicitud para recuperar contraseña",
                    Body = $"Puede recuperar su contraseña haciendo click en el siguiente enlace: {resetUrl}, utilizando el siguiente token: {randomPass} ",
                    IsBodyHtml = true
                };
                correo.To.Add(toEmail);

                using (var smtpClient = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtpClient.EnableSsl = true;
                    smtpClient.Credentials = new NetworkCredential("carolina.residenciadevida@gmail.com", "teye iucc maxo erqa\r\n"); // Usa aquí la contraseña de aplicación si la tienes
                    smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;

                    await smtpClient.SendMailAsync(correo);
                }

                return true;
            }
            catch (SmtpException ex)
            {
                Console.WriteLine("Error al enviar el correo: " + ex.Message);
                return false;
            }
        }

        /*

        [HttpPost]
        public async Task<IActionResult> Activate2FA(string userId)
        {
            // Genera una clave secreta única para el usuario
            var secretKey = _twoFactorAuthService.GenerateSecretKey();

            // Genera la URL del QR para configurar 2FA en una app de autenticación
            var urlQr = _qrCodeService.GenerateQrCodeUrl(userId, "MyApp", secretKey);

            // Opcional: guarda el `secretKey` en la base de datos para el usuario específico
            await SaveUserSecretKey(userId, secretKey);

            return Ok(new { secretKey, urlQr });
        }

        [HttpPost]
        public async Task<IActionResult> Verify2FA(string userId, string code)
        {
            // Recupera la clave secreta almacenada para el usuario
            var secretKey = await GetUserSecretKey(userId);

            if (secretKey == null)
            {
                return NotFound("El usuario no tiene 2FA activado.");
            }

            // Verifica el código utilizando la clave secreta
            bool isValid = _twoFactorAuthService.Validate2FACode(secretKey, code);

            if (isValid)
            {
                return Ok("Código 2FA válido.");
            }

            return Unauthorized("Código 2FA inválido.");
        }

        private async Task<string> GetUserSecretKey(string userId)
        {
            // Implementación para recuperar la clave secreta del usuario en la base de datos.
            // Esto depende de cómo hayas configurado el almacenamiento de usuarios.
            return await contexto.Usuarios
                .Where(u => u.Id == int.Parse(userId))
                .Select(u => u.SecretKey)
                .FirstOrDefaultAsync();
        }

        private async Task SaveUserSecretKey(string userId, string secretKey)
        {
            // Implementación para guardar la clave secreta en la base de datos
            var usuario = await contexto.Usuarios.FirstOrDefaultAsync(u => u.Id == int.Parse(userId));
            if (usuario != null)
            {
                usuario.SecretKey = secretKey;
                await contexto.SaveChangesAsync();
            }
        }
        */
    }

}





