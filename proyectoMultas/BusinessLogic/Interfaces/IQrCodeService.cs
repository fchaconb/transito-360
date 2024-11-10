namespace BusinessLogic.Interfaces
{
    public interface IQrCodeService
    {
        string GenerateQrCodeUrl(string userName, string appName, string secretKey);
    }
}