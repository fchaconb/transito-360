using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class RolPermiso
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Permisos")]
        public int IdPermiso { get; set; }
        [ForeignKey("Rol")]
        public int IdRol{ get; set; }
    }
}
