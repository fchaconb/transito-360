using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class usuarioPlaca
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Placas")]
        public int Placa { get; set; }

        [ForeignKey("Usuario")]
        public int Cedula { get; set; }

    }
}
