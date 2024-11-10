using DataAccess.EF.Models;
using DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BusinessLogic;
using DataAccess.EF;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext contexto;

        public AuthController(UserManager<IdentityUser> userManager, IConfiguration configuration, AppDbContext context)
        {
            _userManager = userManager;
            _configuration = configuration;
            contexto = context;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDTO userData)
        {
            var user = await _userManager.FindByNameAsync(userData.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, userData.Password))
            {
                var UsuarioManager = new UsuariosManager(contexto);
                var usuario = await UsuarioManager.GetUsuarioByEmail(userData.UserName);

                var token = await GenerateJwtToken(user);
                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault();
                var userId = usuario.Id;

                return Ok(new { token, role, userId });
            }
            return Unauthorized();
        }

        private async Task<string> GenerateJwtToken(IdentityUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);  // Retrieve the roles for the user
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Add role claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:DurationInMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] LogUpDTO newUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new AppUser
            {
                Email = newUser.Email,
                UserName = newUser.Email,
            };

            var createdUserResult = await _userManager.CreateAsync(user, newUser.Password);

            if (createdUserResult.Succeeded)
            {

                var usuario = new Usuario
                {
                    Cedula = newUser.Cedula,
                    Nombre = newUser.Nombre,
                    Apellido = newUser.Apellido,
                    Correo = newUser.Email,
                    Telefono = newUser.Telefono,
                    fotoCedula = newUser.fotoCedula,
                    fotoPerfil = newUser.fotoPerfil,
                    IdRol = newUser.IdRol,
                    Placas = newUser.Placas
                };

                var roleOfNewUser = await contexto.Roles.FindAsync(newUser.IdRol);
                await _userManager.AddToRoleAsync(user, roleOfNewUser.Nombre);

                var usuariosManager = new UsuariosManager(contexto);

                var usuarioNuevo = await usuariosManager.CrearUsuario(usuario);
                if (usuarioNuevo != null)
                {
                    return Created("Usuario creado exitosamente", null);
                }
                else
                {
                    return BadRequest("Error al crear el usuario en la base de datos.");
                }
            }

            foreach (var error in createdUserResult.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        public async Task<bool> RoleTesting(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                // El usuario no existe
                return false;
            }

            var result = await _userManager.IsInRoleAsync(user, "Admin");
            return result;
        }

        [HttpGet]
        public async Task<IActionResult> MakeAdmin(string userName)
        {
            // Buscar al usuario por su nombre de usuario
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound("Usuario no encontrado");
            }

            // Agregar el rol 'Admin' al usuario
            var result = await _userManager.AddToRoleAsync(user, "Admin");

            if (result.Succeeded)
            {
                return Ok("Usuario agregado al rol de Admin con éxito");
            }

            // Si hubo algún error al agregar el rol
            return BadRequest("No se pudo agregar el rol de Admin al usuario");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            // Find the user by their username
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Delete the user
            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return Ok("User deleted successfully");
            }

            // If there were any errors during the deletion process
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

        // PUT: Update user password
        [HttpPut]
        public async Task<IActionResult> UpdatePassword(string userName, string newPassword)
        {
            // Find the user by their username
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Update the user's password
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (result.Succeeded)
            {
                return Ok("Password updated successfully");
            }

            // If there were any errors during the password update process
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }

    }
}
}