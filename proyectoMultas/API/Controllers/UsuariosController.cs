using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DTO;
using DataAccess.EF;
using Org.BouncyCastle.Crypto.Generators;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .Where(u => u.Id == id)
                .Include(u => u.Placas)
                .FirstOrDefaultAsync();

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        // GET: api/Usuarios/NotRole/1
        [HttpGet("NotRole/{roleId}")]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuariosNotInRole(int roleId)
        {
            var usuarios = await _context.Usuarios
                .Where(u => u.IdRol != roleId)
                .ToListAsync();

            return usuarios;
        }

        // GET: api/Usuarios/Role/1
        [HttpGet("Role/{roleId}")]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuariosInRole(int roleId)
        {
            var usuarios = await _context.Usuarios
                .Where(u => u.IdRol == roleId)
                .ToListAsync();

            return usuarios;
        }

        //GET: api/Usuarios/email
        [HttpGet("email/{email}")]
        public async Task<ActionResult<Usuario>> GetUsuarioByEmail(string email)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == email);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        //GET: api/Usuarios/Cedula
        [HttpGet("Cedula/{cedula}")]
        public async Task<ActionResult<Usuario>> GetUsuarioByCedula(int cedula)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Cedula == cedula);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        // PUT: api/Usuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
            {
                return BadRequest();
            }

            var existingUsuario = await _context.Usuarios
                .Include(u => u.Placas)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (existingUsuario == null)
            {
                return NotFound();
            }

            // Update the properties of the existing user
            existingUsuario.Cedula = usuario.Cedula;
            existingUsuario.Nombre = usuario.Nombre;
            existingUsuario.Apellido = usuario.Apellido;
            existingUsuario.Correo = usuario.Correo;
            existingUsuario.Telefono = usuario.Telefono;
            existingUsuario.fotoCedula = usuario.fotoCedula;
            existingUsuario.fotoPerfil = usuario.fotoPerfil;
            existingUsuario.IdRol = usuario.IdRol;

            // Update the Placas
            if (existingUsuario.Placas != null)
            {
                existingUsuario.Placas.Clear();
            }
            else
            {
                existingUsuario.Placas = new List<Placas>();
            }

            if (usuario.Placas != null)
            {
                foreach (var placa in usuario.Placas)
                {
                    var existingPlaca = await _context.Placas.FindAsync(placa.Id);
                    if (existingPlaca != null)
                    {
                        existingUsuario.Placas.Add(existingPlaca);
                    }
                    else
                    {
                        existingUsuario.Placas.Add(new Placas { Id = placa.Id, UsuarioId = existingUsuario.Id });
                    }
                }
            }

            _context.Entry(existingUsuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // ... existing code ...

        // POST: api/Usuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var usuarioWithPlacas = await _context.Usuarios
                .Include(u => u.Placas)
                .FirstOrDefaultAsync(u => u.Id == usuario.Id);

            return CreatedAtAction("GetUsuario", new { id = usuario.Id }, usuario);
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.Id == id);
        }
    }
}
