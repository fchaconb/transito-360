using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class Rol
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Nombre { get; set; }
    }
}
