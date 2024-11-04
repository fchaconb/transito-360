﻿using System;
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
        [ForeignKey("Placas")]
        public string PlacasId { get; set; }

        [ForeignKey("Multas")]
        public int MultasId { get; set; }
    }
}
