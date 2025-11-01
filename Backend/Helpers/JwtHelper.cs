using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Helpers
{
    /// <summary>
    /// Helper class for JWT token generation, validation, and management
    /// Handles both Access Tokens and Refresh Tokens
    /// </summary>
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Generates a JWT access token with user claims including roles
        /// </summary>
        /// <param name="claims">List of claims to include in the token</param>
        /// <returns>JWT token string</returns>
        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var secretKey = _configuration["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException("JWT SecretKey not configured in appsettings.json");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiryMinutes = int.Parse(_configuration["JwtSettings:ExpiryInMinutes"] ?? "60");

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Generates a cryptographically secure random refresh token
        /// </summary>
        /// <returns>Base64 encoded refresh token string</returns>
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        /// <summary>
        /// Validates a JWT token and returns the claims principal
        /// Used for refresh token validation where we need to extract user info from expired token
        /// </summary>
        /// <param name="token">JWT token to validate</param>
        /// <returns>ClaimsPrincipal if valid, null otherwise</returns>
        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var secretKey = _configuration["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException("JWT SecretKey not configured");

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = false, // Important: We're checking expired tokens for refresh
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidAudience = _configuration["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

                // Ensure the token uses the correct encryption algorithm
                if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new SecurityTokenException("Invalid token algorithm");
                }

                return principal;
            }
            catch (Exception ex)
            {
                // Log the exception in production for debugging
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Validates a JWT token and returns the claims principal (for active tokens)
        /// Used for normal token validation where lifetime matters
        /// </summary>
        /// <param name="token">JWT token to validate</param>
        /// <returns>ClaimsPrincipal if valid, null otherwise</returns>
        public ClaimsPrincipal? GetPrincipalFromToken(string token)
        {
            var secretKey = _configuration["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException("JWT SecretKey not configured");

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true, // Validate token expiration
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidAudience = _configuration["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

                if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new SecurityTokenException("Invalid token algorithm");
                }

                return principal;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Gets the refresh token expiry date based on configuration
        /// </summary>
        /// <returns>DateTime when refresh token should expire</returns>
        public DateTime GetRefreshTokenExpiryDate()
        {
            var expiryDays = int.Parse(_configuration["JwtSettings:RefreshTokenExpiryInDays"] ?? "7");
            return DateTime.UtcNow.AddDays(expiryDays);
        }

        /// <summary>
        /// Gets the access token expiry date based on configuration
        /// </summary>
        /// <returns>DateTime when access token should expire</returns>
        public DateTime GetAccessTokenExpiryDate()
        {
            var expiryMinutes = int.Parse(_configuration["JwtSettings:ExpiryInMinutes"] ?? "60");
            return DateTime.UtcNow.AddMinutes(expiryMinutes);
        }

        /// <summary>
        /// Extracts user ID from JWT token
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>User ID if found, null otherwise</returns>
        public string? GetUserIdFromToken(string token)
        {
            var principal = GetPrincipalFromExpiredToken(token);
            return principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        /// <summary>
        /// Extracts email from JWT token
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>Email if found, null otherwise</returns>
        public string? GetEmailFromToken(string token)
        {
            var principal = GetPrincipalFromExpiredToken(token);
            return principal?.FindFirst(ClaimTypes.Email)?.Value
                   ?? principal?.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
        }

        /// <summary>
        /// Extracts role from JWT token
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>Role if found, null otherwise</returns>
        public string? GetRoleFromToken(string token)
        {
            var principal = GetPrincipalFromExpiredToken(token);
            return principal?.FindFirst(ClaimTypes.Role)?.Value;
        }

        /// <summary>
        /// Checks if a token is expired
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>True if expired, false otherwise</returns>
        public bool IsTokenExpired(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);

                var expiryTimestamp = long.Parse(jwtToken.Claims
                    .First(c => c.Type == JwtRegisteredClaimNames.Exp).Value);

                var expiryDate = DateTimeOffset.FromUnixTimeSeconds(expiryTimestamp).UtcDateTime;

                return expiryDate <= DateTime.UtcNow;
            }
            catch
            {
                return true; // Treat invalid tokens as expired
            }
        }

        /// <summary>
        /// Gets the expiry time from a JWT token
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>Expiry DateTime, or null if invalid</returns>
        public DateTime? GetTokenExpiryTime(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);

                var expiryTimestamp = long.Parse(jwtToken.Claims
                    .First(c => c.Type == JwtRegisteredClaimNames.Exp).Value);

                return DateTimeOffset.FromUnixTimeSeconds(expiryTimestamp).UtcDateTime;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Validates token format without checking expiration
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>True if format is valid, false otherwise</returns>
        public bool IsTokenFormatValid(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return false;

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                return tokenHandler.CanReadToken(token);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Gets all claims from a JWT token
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>Dictionary of claims</returns>
        public Dictionary<string, string>? GetAllClaims(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);

                return jwtToken.Claims.ToDictionary(c => c.Type, c => c.Value);
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Generates a unique JTI (JWT ID) for token tracking
        /// </summary>
        /// <returns>Unique identifier string</returns>
        public static string GenerateJti()
        {
            return Guid.NewGuid().ToString();
        }

        /// <summary>
        /// Creates standard claims for a user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="email">User email</param>
        /// <param name="firstName">First name</param>
        /// <param name="lastName">Last name</param>
        /// <param name="role">User role</param>
        /// <returns>List of claims</returns>
        public static List<Claim> CreateUserClaims(
            string userId,
            string email,
            string firstName,
            string lastName,
            string role)
        {
            return new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Email, email),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Name, $"{firstName} {lastName}"),
                new Claim(ClaimTypes.GivenName, firstName),
                new Claim(ClaimTypes.Surname, lastName),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, GenerateJti()),
                new Claim(JwtRegisteredClaimNames.Iat,
                    DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64)
            };
        }
    }
}