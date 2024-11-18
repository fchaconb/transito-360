namespace DTO
{
    public class ValidateTwoFactorDto
    {
        public string Email { get; set; }
        public string TotpCode { get; set; }
    }
}
