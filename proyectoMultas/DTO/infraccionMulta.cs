using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class infraccionMulta
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("CatalogoInfracciones")]
        public int idInfraccion { get; set; }

        [ForeignKey("Multas")]
        public int idMulta { get; set; }

        public Multas Multa { get; set; }
        public CatalogoInfracciones Infraccion { get; set; }

    }
}