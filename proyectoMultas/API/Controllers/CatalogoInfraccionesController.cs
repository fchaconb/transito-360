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
    public class CatalogoInfraccionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CatalogoInfraccionesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/CatalogoInfracciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CatalogoInfracciones>>> GetCatalogoInfracciones()
        {
            return await _context.CatalogoInfracciones.ToListAsync();
        }

        // GET: api/CatalogoInfracciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CatalogoInfracciones>> GetCatalogoInfracciones(int id)
        {
            var catalogoInfracciones = await _context.CatalogoInfracciones.FindAsync(id);

            if (catalogoInfracciones == null)
            {
                return NotFound();
            }

            return catalogoInfracciones;
        }

        // PUT: api/CatalogoInfracciones/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCatalogoInfracciones(int id, CatalogoInfracciones catalogoInfracciones)
        {
            if (id != catalogoInfracciones.Id)
            {
                return BadRequest();
            }

            _context.Entry(catalogoInfracciones).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CatalogoInfraccionesExists(id))
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

        // POST: api/CatalogoInfracciones
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CatalogoInfracciones>> PostCatalogoInfracciones(CatalogoInfracciones catalogoInfracciones)
        {
            _context.CatalogoInfracciones.Add(catalogoInfracciones);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCatalogoInfracciones", new { id = catalogoInfracciones.Id }, catalogoInfracciones);
        }

        // DELETE: api/CatalogoInfracciones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCatalogoInfracciones(int id)
        {
            var catalogoInfracciones = await _context.CatalogoInfracciones.FindAsync(id);
            if (catalogoInfracciones == null)
            {
                return NotFound();
            }

            _context.CatalogoInfracciones.Remove(catalogoInfracciones);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CatalogoInfraccionesExists(int id)
        {
            return _context.CatalogoInfracciones.Any(e => e.Id == id);
        }
    }
}
