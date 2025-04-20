﻿using System;
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
        public DateTime fecha { get; set; }
        [Required]
        public string estado { get; set; }
        [Required]
        public string resolucion { get; set; }
        [Required]
        public bool necesitaDeclaracion { get; set; }
        public string? declaracion { get; set; }

        [ForeignKey("Multas")]
        public int idMulta { get; set; }

        [ForeignKey("Usuario")]
        public int idUsuarioFinal { get; set; }
        [ForeignKey("Usuario")]
        public int idOficial { get; set; }
        [ForeignKey("Usuario")]
        public int idJuez { get; set; }
    }
}
