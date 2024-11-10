using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.Interfaces
{
    public interface ITwoFactorAuthService
    {
        string GenerateSecretKey();
        bool Validate2FACode(string secretKey, string code);
    }
}
