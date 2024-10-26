
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

            return usuario;
        }
    }
}
