using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;
using System.Numerics;

namespace DTO
{
    public class Multas
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string nombreInfractor { get; set; }
        [Required]
        public string apellidoInfractor { get; set; }
        [Required]
        public int cedulaInfractor { get; set; }
        [Required]
        public float longitud { get; set; }
        [Required]
        public float latitud { get; set; }
        [Required]
        public DateTime fecha { get; set; }
        [Required]
        public string pagada { get; set; }
        [Required]
        public string fotoSinpe { get; set; }
        [Required]
        public double total { get; set; }

        [ForeignKey("Usuario")]
        public int IdOficial { get; set; }

        public Disputas Disputa { get; set; }


    }
}