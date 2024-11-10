using QRCoder;
using System;
using System.IO;
using BusinessLogic.Interfaces;

namespace BusinessLogic.Services
{
    public class QrCodeService : IQrCodeService
    {
        public string GenerateQrCodeUrl(string userName, string appName, string secretKey)
        {
            // Genera la URL en formato `otpauth://totp/...`
            string url = $"otpauth://totp/{appName}:{userName}?secret={secretKey}&issuer={appName}";

            return url;
        }
    }
}