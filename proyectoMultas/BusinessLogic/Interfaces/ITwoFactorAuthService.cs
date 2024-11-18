using Microsoft.Exchange.WebServices.Data;

namespace BusinessLogic.Interfaces
{
    public interface ITwoFactorAuthService
    {
        Task<ServiceResult> EnableTwoFactorAsync(string email, string password);
        bool ValidateTwoFactorCode(string email, string totpCode);
        Task<ServiceResult> DisableTwoFactorAsync(string email, string password);
    }
}
