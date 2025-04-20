using DTO;
using iText.Layout.Properties;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Xml;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

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

        public async Task SendFacturaEmail(Facturas factura, Usuario usuario)
        {
            var pdfPath = GeneratePDF(factura, usuario);
            var xmlPath = GenerateXML(factura, usuario);

            var apiKey = _configuration["SendGrid:ApiKey"];
            var fromEmail = _configuration["SendGrid:FromEmail"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(fromEmail);
            var subject = "Factura Tránsito 360";
            var to = new EmailAddress(usuario.Correo);
            var plainTextContent = "Factura adjunta";
            var htmlContent = "<strong>Factura adjunta</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            msg.AddAttachment("Factura.pdf", Convert.ToBase64String(File.ReadAllBytes(pdfPath)));
            msg.AddAttachment("Factura.xml", Convert.ToBase64String(File.ReadAllBytes(xmlPath)));
            var response = await client.SendEmailAsync(msg);
        }

        public async Task SendNotificacion(Notificacion notificacion, Usuario usuario)
        {
            var apiKey = _configuration["SendGrid:ApiKey"];
            var fromEmail = _configuration["SendGrid:FromEmail"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(fromEmail);
            var subject = notificacion.Titulo;
            var to = new EmailAddress(usuario.Correo);
            var plainTextContent = notificacion.Descripcion;
            var htmlContent = notificacion.Descripcion;
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }

        private string GeneratePDF(Facturas factura, Usuario usuario)
        {
            var pdfPath = Path.Combine(Path.GetTempPath(), $"Factura_{factura.Id}.pdf");

            using (var writer = new PdfWriter(pdfPath))
            {
                using (var pdf = new PdfDocument(writer))
                {
                    var document = new Document(pdf);

                    // Title
                    document.Add(new Paragraph("Transito 360")
                        .SetTextAlignment(TextAlignment.CENTER)
                        .SetFontSize(20));

                    // Client details
                    document.Add(new Paragraph("Cliente:"));
                    document.Add(new Paragraph($"Numero de Cedula: {usuario.Cedula}"));
                    document.Add(new Paragraph($"Nombre Completo: {usuario.Nombre} {usuario.Apellido}"));

                    // Factura details
                    document.Add(new Paragraph("Detalle de la Factura"));
                    document.Add(new Paragraph($"Fecha de Pago: {factura.fechaPago}"));
                    document.Add(new Paragraph($"Detalle: {factura.detalle}"));
                    document.Add(new Paragraph($"Metodo de Pago: {factura.metodoPago}"));
                    document.Add(new Paragraph($"SubTotal: {factura.subTotal}"));
                    document.Add(new Paragraph($"Total: {factura.total}"));
                }
            }

            return pdfPath;
        }

        private string GenerateXML(Facturas factura, Usuario usuario)
        {
            var xmlPath = Path.Combine(Path.GetTempPath(), $"Factura_{factura.Id}.xml");

            using (var writer = XmlWriter.Create(xmlPath, new XmlWriterSettings { Indent = true }))
            {
                writer.WriteStartDocument();
                writer.WriteStartElement("Factura");

                // Client details
                writer.WriteStartElement("Cliente");
                writer.WriteElementString("NumeroDeCedula", $"{usuario.Cedula}");
                writer.WriteElementString("NombreCompleto", $"{usuario.Nombre} {usuario.Apellido}");
                writer.WriteEndElement();

                // Factura details
                writer.WriteStartElement("DetalleDeLaFactura");
                writer.WriteElementString("FechaDePago", factura.fechaPago.ToString("yyyy-MM-dd"));
                writer.WriteElementString("Detalle", factura.detalle);
                writer.WriteElementString("MetodoDePago", factura.metodoPago);
                writer.WriteElementString("SubTotal", factura.subTotal.ToString());
                writer.WriteElementString("Total", factura.total.ToString());
                writer.WriteEndElement();

                writer.WriteEndElement();
                writer.WriteEndDocument();
            }

            return xmlPath;
        }
    }
}
