using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DTO;
using DataAccess.EF;
using Azure.AI.Vision.ImageAnalysis;
using Azure;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MultasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public MultasController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Multas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Multas>>> GetMultas()
        {
            return await _context.Multas.ToListAsync();
        }

        // GET: api/Multas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Multas>> GetMultas(int id)
        {
            var multas = await _context.Multas
                .Include(m => m.multaPlacas)
                .Include(m => m.infraccionMultas)
                .FirstOrDefaultAsync(m => m.Id == id);


            if (multas == null)
            {
                return NotFound();
            }

            return multas;
        }

        //GET: api/Multas/InfractorID
        [HttpGet("IdInfractor/{infractorID}")]
        public async Task<ActionResult<IEnumerable<Multas>>> GetMultasByInfractorID(int infractorID)
        {
            var multas = await _context.Multas
                .Where(m => m.IdInfractor == infractorID)
                .Include(m => m.multaPlacas)
                .Include(m => m.infraccionMultas)
                .ToListAsync();

            return multas;
        }

        //GET: api/Multas/InfractorID/Resolved
        [HttpGet("IdInfractor/{infractorID}/Resolved")]
        public async Task<ActionResult<IEnumerable<Multas>>> GetMultasByInfractorIDResolved(int infractorID)
        {
            var multas = await _context.Multas
                .Where(m => m.IdInfractor == infractorID && m.resuelta == true)
                .Include(m => m.multaPlacas)
                .Include(m => m.infraccionMultas)
                .ToListAsync();

            return multas;
        }

        //GET: api/Multas/InfractorID/NotResolved
        [HttpGet("IdInfractor/{infractorID}/NotResolved")]
        public async Task<ActionResult<IEnumerable<Multas>>> GetMultasByInfractorIDNotResolved(int infractorID)
        {
            var multas = await _context.Multas
                .Where(m => m.IdInfractor == infractorID && m.resuelta == false)
                .Include(m => m.multaPlacas)
                .Include(m => m.infraccionMultas)
                .ToListAsync();

            return multas;
        }

        // GET: api/Multas/OficialID
        [HttpGet("IdOficial/{oficialID}")]
        public async Task<ActionResult<IEnumerable<Multas>>> GetMultasByOficialID(int oficialID)
        {
            var multas = await _context.Multas
                .Where(m => m.IdOficial == oficialID)
                .Include(m => m.multaPlacas)
                .Include(m => m.infraccionMultas)
                .ToListAsync();

            return multas;
        }

        // GET: api/Multas/PlacaID and not resolved
        [HttpGet("PlacaID/{placaID}")]
        public async Task<ActionResult<IEnumerable<Multas>>> GetMultasByPlacaID(string placaID)
        {
            var multas = await _context.Multas
                .Where(m => m.multaPlacas.Any(mp => mp.PlacasId == placaID) && m.resuelta == false)
                .Include(m => m.multaPlacas)
                .Include(m => m.infraccionMultas)
                .ToListAsync();
            return multas;
        }

        // PUT: api/Multas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMultas(int id, Multas multas)
        {
            if (id != multas.Id)
            {
                return BadRequest();
            }

            _context.Entry(multas).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MultasExists(id))
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

        // POST: api/Multas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Multas>> PostMultas(Multas multas)
        {
            _context.Multas.Add(multas);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMultas", new { id = multas.Id }, multas);
        }

        // POST: api/Multas/Camaras
        [HttpPost("Camaras")]
        public async Task<ActionResult<Multas>> PostMultasFromCameras(Multas multas, string imgURL)
        {
            // Crear un analisis de la imagen de la cedula
            var client = new ImageAnalysisClient(
                new Uri(_configuration["AzureOCR:Endpoint"]),
                new AzureKeyCredential(_configuration["AzureOCR:Key"])
            );

            var analysisResult = await client.AnalyzeAsync(
                new Uri(imgURL),
                VisualFeatures.Read,
                new ImageAnalysisOptions { Language = "es", GenderNeutralCaption = true }
            );

            string placasId = null;
            foreach (DetectedTextBlock block in analysisResult.Value.Read.Blocks)
            {
                foreach (DetectedTextLine line in block.Lines)
                {
                    Console.WriteLine($"   Line: '{line.Text}', Bounding Polygon: [{string.Join(" ", line.BoundingPolygon)}]");

                    if (System.Text.RegularExpressions.Regex.IsMatch(line.Text, @"^[A-Z]{3}-\d{3}$") || System.Text.RegularExpressions.Regex.IsMatch(line.Text, @"^\d+$"))
                    {
                        placasId = line.Text.Replace("-", "");
                        break;
                    }
                }
                if (placasId != null)
                {
                    break;
                }
            }

            if (placasId == null)
            {
                return BadRequest("No se encontró una placa en la imagen");
            }

            // Check if the user exists
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Cedula == multas.cedulaInfractor);
            int? usuarioId = user?.Id;
            multas.IdInfractor = usuarioId;

            // Check if the placasId exists
            var existingPlacas = await _context.Placas.FindAsync(placasId);
            if (existingPlacas == null)
            {
                // Create a new Placas entry if it doesn't exist
                var newPlacas = new Placas
                {
                    Id = placasId,
                    UsuarioId = usuarioId
                };
                _context.Placas.Add(newPlacas);
                await _context.SaveChangesAsync();
            }

            var multa = new Multas
            {
                nombreInfractor = multas.nombreInfractor,
                apellidoInfractor = multas.apellidoInfractor,
                cedulaInfractor = multas.cedulaInfractor,
                longitud = multas.longitud,
                latitud = multas.latitud,
                fecha = multas.fecha,
                pagada = multas.pagada,
                resuelta = multas.resuelta,
                fotoSinpe = multas.fotoSinpe,
                total = multas.total,
                IdOficial = multas.IdOficial,
                IdInfractor = usuarioId,
                infraccionMultas = multas.infraccionMultas,
                multaPlacas = new List<multaPlaca>
                {
                    new multaPlaca
                    {
                        PlacasId = placasId
                    }
                }
            };

            _context.Multas.Add(multa);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMultas", new { id = multas.Id }, multas);
        }

        // DELETE: api/Multas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMultas(int id)
        {
            var multas = await _context.Multas.FindAsync(id);
            if (multas == null)
            {
                return NotFound();
            }

            _context.Multas.Remove(multas);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MultasExists(int id)
        {
            return _context.Multas.Any(e => e.Id == id);
        }
    }
}
