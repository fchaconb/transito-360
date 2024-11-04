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
    public class infraccionMultasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public infraccionMultasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/infraccionMultas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<infraccionMulta>>> GetinfraccionMulta()
        {
            return await _context.infraccionMulta.ToListAsync();
        }

        // GET: api/infraccionMultas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<infraccionMulta>> GetinfraccionMulta(int id)
        {
            var infraccionMulta = await _context.infraccionMulta.FindAsync(id);

            if (infraccionMulta == null)
            {
                return NotFound();
            }

            return infraccionMulta;
        }

        // PUT: api/infraccionMultas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutinfraccionMulta(int id, infraccionMulta infraccionMulta)
        {
            if (id != infraccionMulta.CatalogoInfraccionesId)
            {
                return BadRequest();
            }

            _context.Entry(infraccionMulta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!infraccionMultaExists(id))
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

        // POST: api/infraccionMultas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<infraccionMulta>> PostinfraccionMulta(infraccionMulta infraccionMulta)
        {
            _context.infraccionMulta.Add(infraccionMulta);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (infraccionMultaExists(infraccionMulta.CatalogoInfraccionesId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetinfraccionMulta", new { id = infraccionMulta.CatalogoInfraccionesId }, infraccionMulta);
        }

        // DELETE: api/infraccionMultas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteinfraccionMulta(int id)
        {
            var infraccionMulta = await _context.infraccionMulta.FindAsync(id);
            if (infraccionMulta == null)
            {
                return NotFound();
            }

            _context.infraccionMulta.Remove(infraccionMulta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool infraccionMultaExists(int id)
        {
            return _context.infraccionMulta.Any(e => e.CatalogoInfraccionesId == id);
        }
    }
}
