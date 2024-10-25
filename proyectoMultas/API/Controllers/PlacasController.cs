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
    public class PlacasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlacasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Placas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Placas>>> GetPlacas()
        {
            return await _context.Placas.ToListAsync();
        }

        // GET: api/Placas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Placas>> GetPlacas(string id)
        {
            var placas = await _context.Placas.FindAsync(id);

            if (placas == null)
            {
                return NotFound();
            }

            return placas;
        }

        // PUT: api/Placas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlacas(string id, Placas placas)
        {
            if (id != placas.Id)
            {
                return BadRequest();
            }

            _context.Entry(placas).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlacasExists(id))
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

        // POST: api/Placas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Placas>> PostPlacas(Placas placas)
        {
            _context.Placas.Add(placas);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PlacasExists(placas.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPlacas", new { id = placas.Id }, placas);
        }

        // DELETE: api/Placas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlacas(string id)
        {
            var placas = await _context.Placas.FindAsync(id);
            if (placas == null)
            {
                return NotFound();
            }

            _context.Placas.Remove(placas);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PlacasExists(string id)
        {
            return _context.Placas.Any(e => e.Id == id);
        }
    }
}
