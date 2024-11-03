using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class Disputas
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string razon { get; set; }
        [Required]
        public string descripcion { get; set; }
        [Required]
        public string estado { get; set; }
        [Required]
        public string declaracion { get; set; }

        [ForeignKey("Multa")]
        public int idMulta { get; set; }

        public Multas Multa { get; set; }

        // Relaciones con Usuario para diferentes roles
        public int IdUsuarioFinal { get; set; }
        public Usuario UsuarioFinal { get; set; }

        public int IdOficial { get; set; }
        public Usuario UsuarioOficial { get; set; }
        public int IdJuez { get; set; }
        public Usuario Juez { get; set; }
    }
}
