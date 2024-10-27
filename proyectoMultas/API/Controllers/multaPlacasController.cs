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
    public class multaPlacasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public multaPlacasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/multaPlacas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<multaPlaca>>> GetmultaPlacas()
        {
            return await _context.multaPlacas.ToListAsync();
        }

        // GET: api/multaPlacas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<multaPlaca>> GetmultaPlaca(int id)
        {
            var multaPlaca = await _context.multaPlacas.FindAsync(id);

            if (multaPlaca == null)
            {
                return NotFound();
            }

            return multaPlaca;
        }

        // PUT: api/multaPlacas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutmultaPlaca(int id, multaPlaca multaPlaca)
        {
            if (id != multaPlaca.Id)
            {
                return BadRequest();
            }

            _context.Entry(multaPlaca).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!multaPlacaExists(id))
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

        // POST: api/multaPlacas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<multaPlaca>> PostmultaPlaca(multaPlaca multaPlaca)
        {
            _context.multaPlacas.Add(multaPlaca);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetmultaPlaca", new { id = multaPlaca.Id }, multaPlaca);
        }

        // DELETE: api/multaPlacas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletemultaPlaca(int id)
        {
            var multaPlaca = await _context.multaPlacas.FindAsync(id);
            if (multaPlaca == null)
            {
                return NotFound();
            }

            _context.multaPlacas.Remove(multaPlaca);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool multaPlacaExists(int id)
        {
            return _context.multaPlacas.Any(e => e.Id == id);
        }
    }
}
