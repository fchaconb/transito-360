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
    public class usuarioPlacasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public usuarioPlacasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/usuarioPlacas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<usuarioPlaca>>> GetusuarioPlacas()
        {
            return await _context.usuarioPlacas.ToListAsync();
        }

        // GET: api/usuarioPlacas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<usuarioPlaca>> GetusuarioPlaca(int id)
        {
            var usuarioPlaca = await _context.usuarioPlacas.FindAsync(id);

            if (usuarioPlaca == null)
            {
                return NotFound();
            }

            return usuarioPlaca;
        }

        // PUT: api/usuarioPlacas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutusuarioPlaca(int id, usuarioPlaca usuarioPlaca)
        {
            if (id != usuarioPlaca.Id)
            {
                return BadRequest();
            }

            _context.Entry(usuarioPlaca).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!usuarioPlacaExists(id))
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

        // POST: api/usuarioPlacas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<usuarioPlaca>> PostusuarioPlaca(usuarioPlaca usuarioPlaca)
        {
            _context.usuarioPlacas.Add(usuarioPlaca);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetusuarioPlaca", new { id = usuarioPlaca.Id }, usuarioPlaca);
        }

        // DELETE: api/usuarioPlacas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteusuarioPlaca(int id)
        {
            var usuarioPlaca = await _context.usuarioPlacas.FindAsync(id);
            if (usuarioPlaca == null)
            {
                return NotFound();
            }

            _context.usuarioPlacas.Remove(usuarioPlaca);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool usuarioPlacaExists(int id)
        {
            return _context.usuarioPlacas.Any(e => e.Id == id);
        }
    }
}
