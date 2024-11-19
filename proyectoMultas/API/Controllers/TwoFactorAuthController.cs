using DTO;
using Microsoft.AspNetCore.Mvc;
using BusinessLogic.Interfaces;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TwoFactorAuthController : ControllerBase
    {
        private readonly ITwoFactorAuthService _twoFactorAuthService;

        public TwoFactorAuthController(ITwoFactorAuthService twoFactorAuthService)
        {
            _twoFactorAuthService = twoFactorAuthService;
        }

        [HttpPost("enable")]
        public async Task<IActionResult> EnableTwoFactor([FromBody] EnableTwoFactorDto request)
        {
            var result = await _twoFactorAuthService.EnableTwoFactorAsync(request.Email, request.Password);

            if (!result.Success)
                return BadRequest(result.Message);

            var qrCodeBase64 = "data:image/png;base64," + result.Data;

            return Ok(new { QrCodeBase64 = qrCodeBase64 });
        }


        [HttpPost("validate")]
        public IActionResult ValidateTwoFactor([FromBody] ValidateTwoFactorDto request)
        {
            var isValid = _twoFactorAuthService.ValidateTwoFactorCode(request.Email, request.TotpCode);
            if (!isValid)
                return BadRequest("Invalid 2FA code.");

            return Ok("2FA code validated successfully.");
        }

        [HttpPost("disable")]
        public async Task<IActionResult> DisableTwoFactor([FromBody] EnableTwoFactorDto request)
        {
            var result = await _twoFactorAuthService.DisableTwoFactorAsync(request.Email, request.Password);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Message);
        }
    }
}
