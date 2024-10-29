using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DTO
{
    public class LogUpDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public int Cedula { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public int Telefono { get; set; }
        public byte[] fotoCedula { get; set; }
        public byte[] fotoPerfil { get; set; }
        public int IdRol { get; set; }
    }
}
