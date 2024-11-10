using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;


namespace BusinessLogic.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class SmtpEmailSender : IEmailSender
    {
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var correo = new MailMessage();
            correo.From = new MailAddress("carolina.residenciadevida@gmail.com");
            correo.To.Add(toEmail);
            correo.Subject = subject;
            correo.Body = body;
            correo.IsBodyHtml = true;

            using (var smtpClient = new SmtpClient("smtp.gmail.com", 587))
            {
                smtpClient.Credentials = new NetworkCredential("carolina.residenciadevida@gmail.com", "teye iucc maxo erqa\r\n");
                smtpClient.EnableSsl = true;

                await smtpClient.SendMailAsync(correo);
            }
        }
    }
}
