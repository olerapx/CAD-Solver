using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Security.Cryptography;

namespace CAD_Solver.Utils
{
    public class Cryptor
    {
        public static string Encrypt(string input, out string salt)
        {
            byte[] _salt = new byte[128 / 8];

            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(_salt);
            }

            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                                                    password: input,
                                                    salt: _salt,
                                                    prf: KeyDerivationPrf.HMACSHA1,
                                                    iterationCount: 10000,
                                                    numBytesRequested: 256 / 8));

            salt = Convert.ToBase64String(_salt);
            return hash;
        }
    }
}
