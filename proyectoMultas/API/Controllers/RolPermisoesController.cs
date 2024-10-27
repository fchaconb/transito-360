using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DTO;
using DataAccess.EF;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolPermisoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolPermisoesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/RolPermisoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolPermiso>>> GetRolPermisos()
        {
            return await _context.RolPermisos.ToListAsync();
        }

        // GET: api/RolPermisoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RolPermiso>> GetRolPermiso(int id)
        {
            var rolPermiso = await _context.RolPermisos.FindAsync(id);

            if (rolPermiso == null)
            {
                return NotFound();
            }

            return rolPermiso;
        }

        // PUT: api/RolPermisoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRolPermiso(int id, RolPermiso rolPermiso)
        {
            if (id != rolPermiso.Id)
            {
                return BadRequest();
            }

            _context.Entry(rolPermiso).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RolPermisoExists(id))
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

        // POST: api/RolPermisoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RolPermiso>> PostRolPermiso(RolPermiso rolPermiso)
        {
            _context.RolPermisos.Add(rolPermiso);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRolPermiso", new { id = rolPermiso.Id }, rolPermiso);
        }

        // DELETE: api/RolPermisoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRolPermiso(int id)
        {
            var rolPermiso = await _context.RolPermisos.FindAsync(id);
            if (rolPermiso == null)
            {
                return NotFound();
            }

            _context.RolPermisos.Remove(rolPermiso);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RolPermisoExists(int id)
        {
            return _context.RolPermisos.Any(e => e.Id == id);
        }
    }
}
