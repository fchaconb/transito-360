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
    public class DisputasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DisputasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Disputas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Disputas>>> Getdisputas()
        {
            return await _context.disputas.ToListAsync();
        }

        // GET: api/Disputas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Disputas>> GetDisputas(int id)
        {
            var disputas = await _context.disputas.FindAsync(id);

            if (disputas == null)
            {
                return NotFound();
            }

            return disputas;
        }

        // GET: api/Disputas/InfractorID
        [HttpGet("IdInfractor/{infractorID}")]
        public async Task<ActionResult<IEnumerable<Disputas>>> GetDisputasByInfractorID(int infractorID)
        {
            var disputas = await _context.disputas
                .Where(d => d.idUsuarioFinal == infractorID)
                .ToListAsync();

            return disputas;
        }

        //Get: api/Disputas/JuezID
        [HttpGet("IdJuez/{juezID}/Resolved")]
        public async Task<ActionResult<IEnumerable<Disputas>>> GetDisputasByJuezIDResolved(int juezID)
        {
            var disputas = await _context.disputas
                .Where(d => d.idJuez == juezID && d.estado == "Resuelta")
                .ToListAsync();

            return disputas;
        }


        //Get: api/Disputas/JuezID and not resolved
        [HttpGet("IdJuez/{juezID}/NotResolved")]
        public async Task<ActionResult<IEnumerable<Disputas>>> GetDisputasByJuezIDNotResolved(int juezID)
        {
            var disputas = await _context.disputas
                .Where(d => d.idJuez == juezID && d.estado != "Resuelta")
                .ToListAsync();

            return disputas;
        }

        //Get: api/Disputas/OficialID and necesitadeclaracion
        [HttpGet("IdOficial/{oficialID}/NeedsDeclaration")]
        public async Task<ActionResult<IEnumerable<Disputas>>> GetDisputasByOficialIDNeedsDeclaration(int oficialID)
        {
            var disputas = await _context.disputas
                .Where(d => d.idOficial == oficialID && d.necesitaDeclaracion == true)
                .ToListAsync();

            return disputas;
        }

        // PUT: api/Disputas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDisputas(int id, Disputas disputas)
        {
            if (id != disputas.Id)
            {
                return BadRequest();
            }

            _context.Entry(disputas).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DisputasExists(id))
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

        // POST: api/Disputas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Disputas>> PostDisputas(Disputas disputas)
        {
            _context.disputas.Add(disputas);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDisputas", new { id = disputas.Id }, disputas);
        }

        // DELETE: api/Disputas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDisputas(int id)
        {
            var disputas = await _context.disputas.FindAsync(id);
            if (disputas == null)
            {
                return NotFound();
            }

            _context.disputas.Remove(disputas);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DisputasExists(int id)
        {
            return _context.disputas.Any(e => e.Id == id);
        }
    }
}
