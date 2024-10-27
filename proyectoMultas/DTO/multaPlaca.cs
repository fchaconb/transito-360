using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class multaPlaca
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Placas")]
        public int idPlaca { get; set; }

        [ForeignKey("Multas")]
        public int idMulta { get; set; }
    }
}
