using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class Permisos
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string nombre { get; set; }
    }
}
