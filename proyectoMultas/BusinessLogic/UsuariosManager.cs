
using DTO;
using Microsoft.AspNetCore.Mvc;
using DataAccess.EF;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic
{
    public class UsuariosManager
    {
        private readonly AppDbContext _context;

        public UsuariosManager(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario> CrearUsuario(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var usuarioWithPlacas = await _context.Usuarios
                .Include(u => u.Placas)
                .FirstOrDefaultAsync(u => u.Id == usuario.Id);

            return usuario;
        }

        public async Task<Usuario> GetUsuarioByEmail(string email)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == email);

            if (usuario == null)
            {
                return null;
            }

            return usuario;
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _userService.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest("El correo no está registrado.");
            }

            // Generar token de restablecimiento
            string token = Guid.NewGuid().ToString();
            await _userService.SavePasswordResetTokenAsync(user.Id, token);

            // Enviar correo con el enlace de restablecimiento
            string urlRestablecimiento = $"https://tu-dominio.com/reset-password?token={token}";
            await EnviarCorreoRestablecimiento(request.Email, urlRestablecimiento);

            return Ok("Correo de restablecimiento enviado.");
        }

        private async Task EnviarCorreoRestablecimiento(string email, string urlRestablecimiento)
        {
            var message = new MailMessage();
            message.From = new MailAddress("tu-correo@dominio.com");
            message.To.Add(email);
            message.Subject = "Restablecimiento de Contraseña";
            message.Body = $"Haz clic en el siguiente enlace para restablecer tu contraseña: {urlRestablecimiento}";
            message.IsBodyHtml = true;

            using var client = new SmtpClient("smtp.dominio.com", 587)
            {
                Credentials = new NetworkCredential("tu-correo@dominio.com", "tu-contraseña"),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }






}
}
