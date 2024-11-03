using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class Placas
    {
        [Key]
        public string Id { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }

        public virtual ICollection<Multas> Multas { get; set; } = new List<Multas>();
    }
}
