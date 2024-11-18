using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace BusinessLogic
{
    public class EmailManager
    {
        private readonly IConfiguration _configuration;

        public EmailManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendResetPasswordEmail(string email, string newPass)
        {
            var apiKey = _configuration["SendGrid:ApiKey"];
            var fromEmail = _configuration["SendGrid:FromEmail"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(fromEmail);
            var subject = "Recuperacion de Contraseña Tránsito 360";
            var to = new EmailAddress(email);
            var plainTextContent = $"Su nueva contraseña temporal es: {newPass}";
            var htmlContent = $"<strong>Su nueva contraseña temporal es: {newPass}</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

        }
    }
}
