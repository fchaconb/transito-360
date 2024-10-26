using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class Facturas
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public DateTime fechaPago { get; set; }
        [Required]
        public string detalle { get; set; }
        [Required]
        public double subTotal { get; set; }
        [Required]
        public double total { get; set; }
        [Required]
        public string metodoPago { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        [ForeignKey("Multa")]
        public int IdMulta { get; set; }

    }
}
