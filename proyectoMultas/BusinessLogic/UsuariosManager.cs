
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
            if (!string.IsNullOrEmpty(usuario.fotoCedulaBase64) && !string.IsNullOrEmpty(usuario.fotoPerfilBase64))
            {
                usuario.fotoCedula = Convert.FromBase64String(usuario.fotoCedulaBase64);
                usuario.fotoPerfil = Convert.FromBase64String(usuario.fotoPerfilBase64);
            }

            usuario.fotoCedulaBase64 = null;
            usuario.fotoPerfilBase64 = null;

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






    }
}
