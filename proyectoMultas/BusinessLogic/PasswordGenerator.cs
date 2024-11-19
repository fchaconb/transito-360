using System;
using System.Security.Cryptography;
using System.Text;

namespace BusinessLogic
{
    public class PasswordGenerator
    {
        public string GeneratePassword(int length)
        {
            const string validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
            char[] password = new char[length];
            byte[] randomBytes = new byte[length];

            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }

            for (int i = 0; i < length; i++)
            {
                int index = randomBytes[i] % validChars.Length;
                password[i] = validChars[index];
            }

            return new string(password);
        }
    }
}
