I'm working on a full stack project where I'm building Backend backend with ASP.NET 9 Web API project and front end with React 19 (with vite and TypeScript), Now I have implimented a basic authetication and authorization system in my project, but I'm getting some issues while using the social logins with the clerk

Here is the backend part of my authetication system
-- Controllers

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TourvistoAPI.Configurations;
using TourvistoAPI.Data;
using TourvistoAPI.Models;
using TourvistoAPI.Models.DTOs.Requests;
using TourvistoAPI.Models.DTOs.Responses;

namespace TourvistoAPI.Controllers
{
[Route("api/authmanagement/[action]")]
[ApiController]
public class AuthManagementController : ControllerBase
{
private readonly UserManager<ThisApplicationUser> \_userManager;
private readonly JwtConfig \_jwtConfig;
private readonly TokenValidationParameters \_tokenValidationParameters;
private readonly ApplicationDbContext \_dbContext;
private readonly RoleManager<IdentityRole> \_roleManager;
private readonly ILogger<AuthManagementController> \_logger;

        public AuthManagementController(UserManager<ThisApplicationUser> userManager, IOptionsMonitor<JwtConfig> optionsMonitor, TokenValidationParameters tokenValidationParameters, ApplicationDbContext dbContext, RoleManager<IdentityRole> roleManager, ILogger<AuthManagementController> logger)
        {
            _userManager = userManager;
            _jwtConfig = optionsMonitor.CurrentValue;
            _tokenValidationParameters = tokenValidationParameters;
            _dbContext = dbContext;
            _roleManager = roleManager;
            _logger = logger;
        }

        [HttpPost]
        [ActionName("Register")]
        public async Task<IActionResult> Register([FromBody] UserRegestrationDto userRegestrationDto)
        {
            try
            {
                if (userRegestrationDto == null || !ModelState.IsValid)
                {
                    return BadRequest(new UserRegistrationResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Invalid payload" }
                    });
                }

                var existingUser = await _userManager.FindByEmailAsync(userRegestrationDto.Email);
                if (existingUser != null)
                {
                    return BadRequest(new UserRegistrationResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Email already in use" }
                    });
                }

                var allUsersCount = await _userManager.Users.CountAsync();
                var newRole = allUsersCount == 0 ? "admin" : "user";

                var newUser = new ThisApplicationUser()
                {
                    Email = userRegestrationDto.Email,
                    Role = newRole,
                    ProfileUrl = userRegestrationDto.ProfileUrl,
                    DateJoined = DateTime.UtcNow,
                    UserName = userRegestrationDto.Email
                };

                var isCreated = await _userManager.CreateAsync(newUser, userRegestrationDto.Password);
                if (!isCreated.Succeeded)
                {
                    return BadRequest(new UserRegistrationResponse
                    {
                        Success = false,
                        Errors = isCreated.Errors.Select(x => x.Description).ToList()
                    });
                }

                var roleResult = await _userManager.AddToRoleAsync(newUser, newRole);
                if (!roleResult.Succeeded)
                {
                    return BadRequest(new UserRegistrationResponse
                    {
                        Success = false,
                        Errors = roleResult.Errors.Select(x => x.Description).ToList()
                    });
                }

                // Generate JWT token
                var tokenResult = await GenerateJwtToken(newUser);

                // Get user roles (should have the role we just added)
                var userRoles = await _userManager.GetRolesAsync(newUser);

                var authResponse = new UserRegistrationResponse
                {
                    Success = tokenResult.Success,
                    Token = tokenResult.Token,
                    RefreshToken = tokenResult.RefreshToken,
                    Name = newUser.UserName,
                    Email = newUser.Email,
                    Role = userRoles.FirstOrDefault() ?? newRole, // Use FirstOrDefault for safety
                };

                return Ok(authResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new UserRegistrationResponse
                {
                    Success = false,
                    Errors = new List<string> { "An error occurred during registration. Please try again." }
                });
            }
        }


        public async Task<List<Claim>> GetAllValidClaims(ThisApplicationUser user)
        {
            var _options = new IdentityOptions();
            var claims = new List<Claim>
            {
                    new Claim("Id", user.Id),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email!),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            var userClaims = await _userManager.GetClaimsAsync(user);
            claims.AddRange(userClaims);
            var userRoles = await _userManager.GetRolesAsync(user);

            foreach (var userRole in userRoles)
            {
                var role = await _roleManager.FindByNameAsync(userRole);
                if (role != null)
                {
                    claims.Add(new Claim(ClaimTypes.Role, userRole));
                    var roleClaims = await _roleManager.GetClaimsAsync(role);
                    foreach (var roleClaim in roleClaims)
                    {
                        if (!claims.Contains(roleClaim))
                            claims.Add(roleClaim);
                    }
                }
            }
            return claims;
        }


        public async Task<AuthResult> GenerateJwtToken(ThisApplicationUser user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtConfig.JwtSecret);

            var claims = await GetAllValidClaims(user);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddSeconds(30), // 5 - 10 minutes in production
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            var refreshToken = new RefreshToken
            {
                JwtId = token.Id,
                IsUsed = false,
                IsRevorked = false,
                UserId = user.Id,
                AddedDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddSeconds(20),
                Token = RandomString(35) + Guid.NewGuid()
            };

            await _dbContext.Set<RefreshToken>().AddAsync(refreshToken);
            await _dbContext.SaveChangesAsync();

            return new AuthResult
            {
                Token = jwtTokenHandler.WriteToken(token),
                Success = true,
                RefreshToken = refreshToken.Token
            };
        }


        private static string RandomString(int length)
        {
            var random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }


        [HttpPost]
        [ActionName("Login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequestDto UserLoginRequestDto)
        {
            if (UserLoginRequestDto == null || !ModelState.IsValid)
            {
                return BadRequest(new UserRegistrationResponse
                {
                    Success = false,
                    Errors = new List<string> { "Invalid payload" }
                });
            }
            var existingUser = await _userManager.FindByEmailAsync(UserLoginRequestDto.Email);
            if (existingUser == null)
            {
                return BadRequest(new UserRegistrationResponse
                {
                    Success = false,
                    Errors = new List<string> { "Invalid authentication request" }
                });
            }
            var isCorrect = await _userManager.CheckPasswordAsync(existingUser, UserLoginRequestDto.Password);
            if (!isCorrect)
            {
                return BadRequest(new UserRegistrationResponse
                {
                    Success = false,
                    Errors = new List<string> { "Invalid authentication request" }
                });
            }

            var tokenResponse = await GenerateJwtToken(existingUser);
            var thisUser = await _userManager.FindByEmailAsync(UserLoginRequestDto.Email);
            var authResponse = new UserRegistrationResponse
            {
                Success = tokenResponse.Success,
                Token = tokenResponse.Token,
                RefreshToken = tokenResponse.RefreshToken,
                Name = thisUser.UserName,
                Email = thisUser.Email,
                Role = thisUser.Role,
            };
            return Ok(authResponse);
        }

        [HttpPost]
        [ActionName("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDto tokenRequest)
        {
            if (ModelState.IsValid)
            {
                var result = await VerifyToken(tokenRequest);
                if (result == null)
                {
                    return BadRequest(new AuthResult()
                    {
                        Success = false,
                        Errors = new List<string>() { "Invalid tokens" }
                    });
                }

                return Ok(result);
            }

            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Invalid payload" }
            });
        }

        private async Task<ActionResult<AuthResult>> VerifyToken(TokenRequestDto tokenRequest)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            try
            {
                // Validation 1 - Validate JWT token format
                var tokenInVerification = jwtTokenHandler.ValidateToken(tokenRequest.Token, _tokenValidationParameters, out var validatedToken);

                // Validation 2 - Validate encryption algorithm
                if (validatedToken is JwtSecurityToken jwtSecurityToken)
                {
                    var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);
                    if (!result)
                    {
                        return new AuthResult()
                        {
                            Success = false,
                            Errors = new List<string>() { "Invalid token encryption" }
                        };
                    }
                }

                // Validation 3 - validate expiry date
                var utcExpiryDate = long.Parse(tokenInVerification?.Claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp)?.Value);
                var expiryDate = UnixTimeStampToDateTime(utcExpiryDate);

                if (expiryDate > DateTime.UtcNow)
                {
                    return new AuthResult()
                    {
                        Success = false,
                        Errors = new List<string>() { "Token has not expired yet" }
                    };
                }

                // Validation 4 - validate existence of the token
                var storedToken = await _dbContext.Set<RefreshToken>().FirstOrDefaultAsync(x => x.Token == tokenRequest.RefreshToken);
                if (storedToken == null)
                {
                    return new AuthResult()
                    {
                        Success = false,
                        Errors = new List<string>() { "Refresh token does not exist" }
                    };
                }

                // Validation 5 - validate if token is used
                if (storedToken.IsUsed)
                {
                    return new AuthResult()
                    {
                        Success = false,
                        Errors = new List<string>() { "Refresh token has been used" }
                    };
                }

                // Validation 6 - validate if token is revoked
                if (storedToken.IsRevorked)
                {
                    return new AuthResult()
                    {
                        Success = false,
                        Errors = new List<string>() { "Refresh token has been revoked" }
                    };
                }

                // Validation 7 - validate the token id
                var jti = tokenInVerification?.Claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
                if (storedToken.JwtId != jti)
                {
                    return new AuthResult()
                    {
                        Success = false,
                        Errors = new List<string>() { "Token doesn't match" }
                    };
                }

                // Update current token
                storedToken.IsUsed = true;
                _dbContext.Set<RefreshToken>().Update(storedToken);
                await _dbContext.SaveChangesAsync();

                // Generate a new token
                ThisApplicationUser dbUser = (await _userManager.FindByIdAsync(storedToken.UserId));
                return await GenerateJwtToken(dbUser);
            }
            catch (Exception ex)
            {
                return new AuthResult()
                {
                    Success = false,
                    Errors = new List<string>() { "Server error", ex.Message }
                };
            }
        }

        private DateTime UnixTimeStampToDateTime(long unixTimeStamp)
        {
            var dateTimeVal = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTimeVal = dateTimeVal.AddSeconds(unixTimeStamp);
            return dateTimeVal;
        }
    }

}

--

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TourvistoAPI.Data;
using TourvistoAPI.Models;
using TourvistoAPI.Models.DTOs.Requests;

namespace VillaApi.Controllers
{

    [Route("api/claimssetup/[action]")]
    [ApiController]
    public class ClaimsSetupController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ThisApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<ClaimsSetupController> _logger;

        public ClaimsSetupController(ApplicationDbContext dbContext, UserManager<ThisApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger<ClaimsSetupController> logger)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }


        [HttpGet]
        [ActionName("GetAllClaims")]
        public async Task<IActionResult> GetAllClaims([FromQuery] string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"User does not exist with ID: {userId}");
            }

            var claims = await _userManager.GetClaimsAsync(user);
            return Ok(claims);
        }

        [HttpPost]
        [ActionName("AddClaimToUser")]
        public async Task<IActionResult> AddClaimToUser([FromBody] AddClaimToUserRequestDto addClaimToUserRequestDto)
        {
            var user = await _userManager.FindByIdAsync(addClaimToUserRequestDto.UserId);
            if (user == null)
            {
                return NotFound($"User does not exist with ID: {addClaimToUserRequestDto.UserId}");
            }
            var claim = new Claim(addClaimToUserRequestDto.ClaimType, addClaimToUserRequestDto.ClaimValue);
            var result = await _userManager.AddClaimAsync(user, claim);
            if (result.Succeeded)
            {
                return Ok("Claim added successfully.");
            }
            else
            {
                _logger.LogError("Error adding claim: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                return StatusCode(500, "Internal server error while adding claim.");
            }
        }
    }

}

---

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourvistoAPI.Data;
using TourvistoAPI.Models;
using TourvistoAPI.Models.DTOs.Requests;

namespace VillaApi.Controllers
{

    [Route("api/setup/[action]")]
    [ApiController]
    public class SetupController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ThisApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<SetupController> _logger;

        public SetupController(ApplicationDbContext dbContext, UserManager<ThisApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger<SetupController> logger)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        [HttpGet]
        [ActionName("GetAllRoles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            return Ok(roles);
        }

        [HttpPost]
        [ActionName("CreateRole")]
        public async Task<IActionResult> CreateRole([FromBody] string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return BadRequest("Role name cannot be empty.");
            }
            var roleExists = await _roleManager.RoleExistsAsync(roleName);
            if (roleExists)
            {
                return Conflict("Role already exists.");
            }
            var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
            if (result.Succeeded)
            {
                return Ok("Role created successfully.");
            }
            else
            {
                _logger.LogError("Error creating role: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                return StatusCode(500, "Internal server error while creating role.");
            }
        }

        [HttpGet]
        [ActionName("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPost]
        [ActionName("AsignRoleToUser")]
        public async Task<IActionResult> AsignRoleToUser([FromBody] AssignUserToRoleRequestDto model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.UserId) || string.IsNullOrWhiteSpace(model.RoleName))
            {
                return BadRequest("Invalid user ID or role name.");
            }
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var roleExists = await _roleManager.RoleExistsAsync(model.RoleName);
            if (!roleExists)
            {
                return NotFound("Role not found.");
            }
            var result = await _userManager.AddToRoleAsync(user, model.RoleName);
            if (result.Succeeded)
            {
                return Ok("Role assigned to user successfully.");
            }
            else
            {
                _logger.LogError("Error assigning role to user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                return StatusCode(500, "Internal server error while assigning role to user.");
            }
        }

        [HttpGet]
        [ActionName("GetUserRoles")]
        public async Task<IActionResult> GetUserRoles([FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest("User ID cannot be empty.");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(roles);
        }

        [HttpPost]
        [ActionName("RemoveUserFromRole")]
        public async Task<IActionResult> RemoveUserFromRole([FromBody] AssignUserToRoleRequestDto model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.UserId) || string.IsNullOrWhiteSpace(model.RoleName))
            {
                return BadRequest("Invalid user ID or role name.");
            }
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var roleExists = await _roleManager.RoleExistsAsync(model.RoleName);
            if (!roleExists)
            {
                return NotFound("Role not found.");
            }
            var result = await _userManager.RemoveFromRoleAsync(user, model.RoleName);
            if (result.Succeeded)
            {
                return Ok("Role removed from user successfully.");
            }
            else
            {
                _logger.LogError("Error removing role from user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                return StatusCode(500, "Internal server error while removing role from user.");
            }
        }

    }

}

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourvistoAPI.Controllers;
using TourvistoAPI.Data;
using TourvistoAPI.Models;
using TourvistoAPI.Models.DTOs.Responses;
using TourvistoAPI.Services;

namespace TourvistoAPI.Controllers
{
[Route("api/clerkauth/[action]")]
[ApiController]
public class ClerkAuthController : ControllerBase
{
private readonly UserManager<ThisApplicationUser> \_userManager;
private readonly IClerkService \_clerkService;
private readonly ApplicationDbContext \_dbContext;
private readonly ILogger<ClerkAuthController> \_logger;
private readonly AuthManagementController \_authController;

        public ClerkAuthController(
            UserManager<ThisApplicationUser> userManager,
            IClerkService clerkService,
            ApplicationDbContext dbContext,
            ILogger<ClerkAuthController> logger,
            AuthManagementController authController)
        {
            _userManager = userManager;
            _clerkService = clerkService;
            _dbContext = dbContext;
            _logger = logger;
            _authController = authController;
        }

        [HttpPost]
        [ActionName("Callback")]
        public async Task<IActionResult> Callback([FromBody] ClerkCallbackRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.SessionToken) && string.IsNullOrEmpty(request.UserId))
                {
                    return BadRequest(new UserRegistrationResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Session token or user ID required" }
                    });
                }

                // Get Clerk user
                ClerkUser? clerkUser;
                if (!string.IsNullOrEmpty(request.SessionToken))
                {
                    clerkUser = await _clerkService.GetUserFromSessionToken(request.SessionToken);
                }
                else
                {
                    clerkUser = await _clerkService.GetUserById(request.UserId!);
                }

                if (clerkUser == null)
                {
                    return BadRequest(new UserRegistrationResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Invalid Clerk session" }
                    });
                }

                var email = clerkUser.GetPrimaryEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new UserRegistrationResponse
                    {
                        Success = false,
                        Errors = new List<string> { "No email address found" }
                    });
                }

                // Find or create user
                var existingUser = await _userManager.FindByEmailAsync(email);

                if (existingUser == null)
                {
                    var allUsersCount = await _userManager.Users.CountAsync();
                    var newRole = allUsersCount == 0 ? "admin" : "user";

                    var newUser = new ThisApplicationUser
                    {
                        Email = email,
                        UserName = email,
                        Role = newRole,
                        ProfileUrl = clerkUser.GetProfileImage(),
                        DateJoined = DateTime.UtcNow,
                        EmailConfirmed = true
                    };

                    var result = await _userManager.CreateAsync(newUser);

                    if (!result.Succeeded)
                    {
                        return BadRequest(new UserRegistrationResponse
                        {
                            Success = false,
                            Errors = result.Errors.Select(e => e.Description).ToList()
                        });
                    }

                    await _userManager.AddToRoleAsync(newUser, newRole);
                    existingUser = newUser;
                }

                // Generate JWT tokens
                var tokenResult = await _authController.GenerateJwtToken(existingUser);
                var userRoles = await _userManager.GetRolesAsync(existingUser);

                return Ok(new UserRegistrationResponse
                {
                    Success = true,
                    Token = tokenResult.Token,
                    RefreshToken = tokenResult.RefreshToken,
                    Name = existingUser.UserName,
                    Email = existingUser.Email,
                    Role = userRoles.FirstOrDefault() ?? existingUser.Role
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during Clerk authentication");
                return StatusCode(500, new UserRegistrationResponse
                {
                    Success = false,
                    Errors = new List<string> { "Authentication failed" }
                });
            }
        }
    }

    public class ClerkCallbackRequest
    {
        public string? SessionToken { get; set; }
        public string? UserId { get; set; }
    }

}

----- Database context file
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TourvistoAPI.Models;

namespace TourvistoAPI.Data
{
public class ApplicationDbContext : IdentityDbContext<ThisApplicationUser>
{
public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
{
}

        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }

}

---- Program.cs

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TourvistoAPI.Configurations;
using TourvistoAPI.Data;
using TourvistoAPI.Models;
using TourvistoAPI.Services; // Add this

namespace TourvistoAPI
{
public class Program
{
public static async Task Main(string[] args)
{
var builder = WebApplication.CreateBuilder(args);

            builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("JwtConfig"));
            builder.Services.Configure<ClerkConfig>(builder.Configuration.GetSection("Clerk")); // Add this

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add Clerk HTTP client
            builder.Services.AddHttpClient("ClerkClient", (serviceProvider, client) =>
            {
                var clerkConfig = serviceProvider.GetRequiredService<IConfiguration>();
                var secretKey = clerkConfig["Clerk:SecretKey"];

                client.BaseAddress = new Uri("https://api.clerk.com/v1/");
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", secretKey);
                client.DefaultRequestHeaders.Add("Clerk-API-Version", "2021-02-05");
            });

            // Register Clerk service
            builder.Services.AddScoped<IClerkService, ClerkService>();

            builder.Services.AddIdentity<ThisApplicationUser, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
                options.User.AllowedUserNameCharacters =
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            var key = Encoding.ASCII.GetBytes(builder.Configuration["JwtConfig:JwtSecret"]!);
            var tokenValidationParams = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                RequireExpirationTime = true,
                ClockSkew = TimeSpan.Zero
            };

            builder.Services.AddSingleton(tokenValidationParams);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwt =>
            {
                jwt.SaveToken = true;
                jwt.TokenValidationParameters = tokenValidationParams;
            });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("MustBeAdmin", policy => policy.RequireClaim("role", "Admin"));
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseCors("ReactApp");
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }

}

Note : if you need more info on my backend I'll be more than welcome to provide you

Here is the front end part of my authetication system

-- api setup with axios and Tanstack query

-- api.ts

import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import type {
WeatherResponse,
CreateWeatherResponse,
SignUpRequest,
SignUpResponse,
} from '@/types';

const axiosInstance = axios.create({
baseURL: import.meta.env.VITE_TurVistoAPI_BASE_URL,
});

export const setupAxiosInterceptors = (
getToken: () => Promise<string | null>
) => {
axiosInstance.interceptors.request.use(
async (config) => {
// Try to get token from Clerk first
const clerkToken = await getToken();

      if (clerkToken) {
        config.headers.Authorization = `Bearer ${clerkToken}`;
      } else {
        // Fallback to localStorage for non-Clerk auth
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)

);

// Keep your existing response interceptor for refresh token logic
};

axiosInstance.interceptors.response.use(
(response) => response,
async (error) => {
const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/authmanagement/RefreshToken', {
          refreshToken: refreshToken,
        });

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);

}
);

export const getWeather = async () => {
let url = '/Weather';
return (await axiosInstance.get<WeatherResponse>(url)).data;
};

export const createWeather = async (weather: WeatherResponse) => {
let url = '/Weather';
return await axiosInstance.post<CreateWeatherResponse>(url, weather);
};

export const registerUser = async (user: SignUpRequest) => {
try {
let url = '/authmanagement/Register';
return await axiosInstance.post<SignUpResponse>(url, user);
} catch (error: any) {
console.error(
'Error occurred while registering the user:',
error?.response?.data?.errors
);
throw error;
}
};

export const loginUser = async (user: SignUpRequest) => {
try {
let url = '/authmanagement/Login';
return await axiosInstance.post<SignUpResponse>(url, user);
} catch (error: any) {
console.error(
'Error occurred while logging in the user:',
error?.response?.data?.errros
);
throw error;
}
};

export const clerkCallback = async (
sessionToken: string,
useUserId: boolean = false
) => {
try {
let url = '/clerkauth/Callback';
const payload = useUserId
? { userId: sessionToken, sessionToken: null }
: { sessionToken, userId: null };
return await axiosInstance.post<SignUpResponse>(url, payload);
} catch (error: any) {
console.error('Error in Clerk callback:', error);
throw error;
}
};

-- quries.ts
import { useQuery } from '@tanstack/react-query';
import type { WeatherResponse } from '@/types';
import { getWeather } from './api';

export function useGetWeather() {
return useQuery({
queryKey: ['weather'],
queryFn: () => getWeather(),
});
}

-- mutations.ts

import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { createWeather, registerUser, loginUser, clerkCallback } from './api';
import type {
CreateWeatherResponse,
SignUpRequest,
WeatherResponse,
} from '@/types';

export function useCreateWeatherMutation() {
return useMutation({
mutationFn: (data: WeatherResponse) => createWeather(data),
onMutate: () => {
console.log('Mutate on creating weather');
},
onError: () => {
console.log('Error occured while creating the weather');
},
onSuccess: () => {
console.log('successfully created weather');
},
});
}

export function useRegisterUserMutation() {
return useMutation({
mutationFn: (data: SignUpRequest) => registerUser(data),
onMutate: () => {
console.log('Mutate on registering user');
},
onError: (error) => {
console.log('Error occured while registering the user:', error);
},
onSuccess: (response) => {
const { token, refreshToken } = response.data;
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);
window.location.href = '/dashboard';
},
});
}

export function useLoginUserMutation() {
return useMutation({
mutationFn: (data: SignUpRequest) => loginUser(data),
onMutate: () => {
console.log('Mutate on logging in user');
},
onError: () => {
console.log('Error occured while logging in the user');
},
onSuccess: (response) => {
const { token, refreshToken } = response.data;
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);
window.location.href = '/dashboard';
},
});
}

export function useClerkCallbackMutation() {
return useMutation({
mutationFn: ({
token,
useUserId = false,
}: {
token: string;
useUserId?: boolean;
}) => clerkCallback(token, useUserId),
onSuccess: (response) => {
const { token, refreshToken } = response.data;
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);
window.location.href = '/dashboard';
},
onError: (error) => {
console.error('Clerk callback failed:', error);
},
});
}

--- UserLogin.tsx

import { useState, useEffect } from 'react';
import { data, useParams } from 'react-router';
import { useSignIn, useSignUp, useSession } from '@clerk/clerk-react';
import { useGetWeather } from '@/api/quries';
import {
useCreateWeatherMutation,
useRegisterUserMutation,
useLoginUserMutation,
useClerkCallbackMutation,
} from '@/api/mutations';

import \* as userSlice from '@/features/userSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { UserRole } from '@/types';
import { isValidUserRole } from '@/utils';
import icons from '@/constants/icons';
import { Logo } from '@/components';
import { NotFound } from '@/pages/errors';

import {
Card,
CardContent,
CardFooter,
CardHeader,
CardTitle,
CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const socialProviders = [
{ name: 'Google', icon: icons.googleIcon, key: 'google' },
{ name: 'Facebook', icon: icons.googleIcon, key: 'facebook' },
];

const demoCredentials = {
user: { email: 'demo@user.com', password: 'user123' },
admin: { email: 'demo@admin.com', password: 'admin123' },
};

const UserLogin = () => {
const registerUserMutation = useRegisterUserMutation();
const loginUserMutation = useLoginUserMutation();
const clerkCallbackMutation = useClerkCallbackMutation();
const { signIn } = useSignIn();
const { signUp } = useSignUp();
const { session } = useSession();
const dispatch = useAppDispatch();
const { userType } = useParams();
const [showAll, setShowAll] = useState(false);
const [isSignUp, setIsSignUp] = useState(false);
const [demoMode, setDemoMode] = useState<'user' | 'admin' | null>(null);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const isInvalidUser = !userType || !isValidUserRole(userType);
const role = userType as UserRole;

useEffect(() => {
if (demoMode === 'user') {
setEmail(demoCredentials.user.email);
setPassword(demoCredentials.user.password);
} else if (demoMode === 'admin') {
setEmail(demoCredentials.admin.email);
setPassword(demoCredentials.admin.password);
}
}, [demoMode]);

// Handle successful Clerk authentication
// useEffect(() => {
// const handleClerkAuth = async () => {
// if (session?.id) {
// // Send session token to your backend
// try {
// await clerkCallbackMutation.mutateAsync(session.id);
// } catch (error) {
// console.error('Failed to authenticate with backend:', error);
// }
// }
// };

// handleClerkAuth();
// }, [session]);

const handleSocialLogin = async (provider: string) => {
if (!signIn) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}` as any,
        redirectUrl: 'auth/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    }

};

// useEffect(() => {
// if (user && !user.emailAddresses[0].verification?.status === 'verified') {
// navigate('/auth/verify-email');
// }
// }, [user, navigate]);

const handleSubmitClick = () => {
if (isSignUp) {
registerUserMutation.mutate({ email, password });
} else {
loginUserMutation.mutate({ email, password });
}
};

if (isInvalidUser) return <NotFound />;

const title = [UserRole.Admin, UserRole.DemoAdmin].includes(role)
? 'Admin Dashboard Login'
: 'Start Your Travel Journey';

const message = [UserRole.Admin, UserRole.DemoAdmin].includes(role)
? 'Sign in with Google to manage destinations, itineraries, and user activity with ease.'
: 'Sign in with Google to explore AI-generated itineraries, trending destinations, and much more';

return (
<main
className={`relative ${
        showAll ? 'min-h-screen' : 'h-screen'
      } w-full bg-auth bg-no-repeat bg-cover bg-center overflow-y-auto overflow-x-hidden`} >
<div className='absolute inset-0 bg-light-200/60 z-10' />
<div className='relative z-20 flex items-center justify-center min-h-screen px-4 py-6 sm:py-10'>
<Card className='w-full max-w-[495px] bg-white shadow-xl/30 border border-light-100 rounded-[20px] px-5 sm:px-6 py-8 sm:py-10 shadow-600 text-center flex flex-col gap-4'>
<CardHeader>
<Logo wrapperClasses='flex-center gap-2' />
<CardTitle className='p-28-semibold text-dark-100 mt-6 mb-2'>
{title}
</CardTitle>
<CardDescription className='p-18-regular text-gray-100 leading-7'>
{message}
</CardDescription>
</CardHeader>

          <CardContent className='flex flex-col gap-4 mt-4 sm:mt-6'>
            {socialProviders
              .filter((_, idx) => showAll || idx === 0)
              .map((provider) => (
                <Button
                  key={provider.key}
                  className='w-full flex-center gap-2 border border-light-100 rounded-[8px] shadow-100 py-4 sm:py-5 px-4 p-18-regular leading-6 cursor-pointer bg-primary-100 text-white'
                  onClick={() => handleSocialLogin(provider.key)}
                >
                  <img src={provider.icon} alt={`${provider.name} icon`} />
                  Continue with {provider.name}
                </Button>
              ))}

            {showAll && (
              <>
                <div className='relative flex items-center justify-center text-xs uppercase text-gray-100 before:absolute before:w-full before:h-px before:bg-border before:top-1/2 before:left-0'>
                  <span className='relative z-10 bg-white px-2'>OR</span>
                </div>

                <div className='grid gap-4 text-left'>
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!!demoMode}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                      id='password'
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!!demoMode}
                    />
                  </div>
                  {!isSignUp && (
                    <div className='text-right'>
                      <Button variant='link' className='text-sm cursor-pointer'>
                        Forgot password?
                      </Button>
                    </div>
                  )}
                  <Button
                    className='w-full border border-light-100 rounded-[8px] shadow-100 py-4 sm:py-5 px-4 p-18-regular leading-6 cursor-pointer bg-primary-100 text-white'
                    onClick={handleSubmitClick}
                  >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </Button>
                </div>

                <div className='flex flex-col gap-2 mt-4'>
                  <Button
                    variant='outline'
                    onClick={() => setDemoMode('user')}
                    className='w-full rounded-[8px] shadow-100 py-4 sm:py-5 px-4 p-18-regular leading-6 cursor-pointer'
                  >
                    Demo User Login
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => setDemoMode('admin')}
                    className='w-full rounded-[8px] shadow-100 py-4 sm:py-5 px-4 p-18-regular leading-6 cursor-pointer'
                  >
                    Demo Admin Login
                  </Button>
                </div>
              </>
            )}

            <Button
              variant='ghost'
              className='mt-4 text-primary-100 cursor-pointer'
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? 'Show Less Options' : 'Show More Options'}
            </Button>
          </CardContent>

          <CardFooter className='justify-center mt-2'>
            <span className='text-sm text-gray-100'>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Button
                onClick={() => setIsSignUp((prev) => !prev)}
                className='text-primary-100 cursor-pointer'
                variant='ghost'
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </span>
          </CardFooter>
        </Card>
      </div>
    </main>

);
};

export default UserLogin;

-- SSocallback

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSession, useUser } from '@clerk/clerk-react';
import { useClerkCallbackMutation } from '@/api/mutations';

const SSOCallback = () => {
const navigate = useNavigate();
const { session, isLoaded: sessionLoaded } = useSession();
const { user, isLoaded: userLoaded } = useUser();
const clerkCallbackMutation = useClerkCallbackMutation();
const [hasProcessed, setHasProcessed] = useState(false);

useEffect(() => {
const sendToBackend = async () => {
if (!sessionLoaded || !userLoaded) {
return;
}

      if (!user?.id) {
        console.log('No user found, redirecting to login...');
        navigate('/auth/user');
        return;
      }

      if (hasProcessed) {
        return;
      }

      setHasProcessed(true);

      try {
        console.log('Sending user ID to backend:', user.id);

        // Use User ID instead of session token
        await clerkCallbackMutation.mutateAsync({
          token: user.id,
          useUserId: true,
        });
      } catch (error) {
        console.error('Failed to authenticate with backend:', error);
        setHasProcessed(false);
        setTimeout(() => {
          navigate('/login/user');
        }, 2000);
      }
    };

    sendToBackend();

}, [
sessionLoaded,
userLoaded,
user,
hasProcessed,
clerkCallbackMutation,
navigate,
]);

return (
<div className='flex items-center justify-center min-h-screen bg-gray-50'>
<div className='text-center bg-white p-8 rounded-lg shadow-md'>
<h2 className='text-2xl font-semibold mb-4 text-gray-800'>
{clerkCallbackMutation.isPending
? 'Authenticating...'
: 'Completing sign in...'}
</h2>
<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100 mx-auto'></div>
{clerkCallbackMutation.isError && (
<p className='mt-4 text-red-500 text-sm'>
Authentication failed. Redirecting to login...
</p>
)}
</div>
</div>
);
};

export default SSOCallback;

-- app.tsx

import { BrowserRouter, Routes, Route } from 'react-router';
import SharedLayout from './layout';
import {
Dashboard,
Users,
User,
AddUser,
EditUser,
Trips,
Trip,
AddTrip,
EditTrip,
Destinations,
Destination,
AddDestination,
EditDestination,
} from './pages/admin';
import {
Home,
Destinations as PublicDestinations,
Destination as PublicDestination,
Trips as PublicTrips,
Trip as PublicTrip,
Payment,
PaymentConfirmation,
} from './pages/public';
import { NotFound, Forbidden } from './pages/errors';
import { UserLogin, EmailVerification, SSOCallback } from './pages/auth';

function App() {
return (
<>
<BrowserRouter>
<Routes>
<Route path='/' element={<SharedLayout />}>
<Route index element={<Home />} />
<Route path='forbidden' element={<Forbidden />} />
<Route path='destinations' element={<PublicDestinations />} />
<Route
path='destinations/:destinationId'
element={<PublicDestination />}
/>
<Route path='trips' element={<PublicTrips />} />
<Route path='trips/:tripId' element={<PublicTrip />} />
<Route path='trips/:tripId/payment' element={<Payment />} />
<Route
path='trips/:tripId/paymentConfirmation'
element={<PaymentConfirmation />}
/>
<Route path='admin'>
<Route index element={<Dashboard />} />
<Route path='dashboard' element={<Dashboard />} />
<Route path='users' element={<Users />} />
<Route path='users/:userId' element={<User />} />
<Route path='users/addUser' element={<AddUser />} />
<Route path='users/:userId/editUser' element={<EditUser />} />
<Route path='trips' element={<Trips />} />
<Route path='trips/:tripId' element={<Trip />} />
<Route path='trips/addTrip' element={<AddTrip />} />
<Route path='trips/:tripId/editTrip' element={<EditTrip />} />
<Route path='destinations' element={<Destinations />} />
<Route
path='destinations/:destinationId'
element={<Destination />}
/>
<Route
path='destinations/addDestination'
element={<AddDestination />}
/>
<Route
path='destinations/:destinationId/editDestination'
element={<EditDestination />}
/>
</Route>
</Route>

          <Route path='auth/:userType' element={<UserLogin />} />
          <Route path='auth/verify-email' element={<EmailVerification />} />
          <Route path='auth/sso-callback' element={<SSOCallback />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>

);
}

export default App;

--- main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ClerkProvider } from '@clerk/clerk-react';
import { store } from './store.ts';
import App from './App.tsx';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
throw new Error('Missing Clerk Publishable Key');
}

const queryClient: QueryClient = new QueryClient({
defaultOptions: {
queries: { refetchOnWindowFocus: false, refetchOnReconnect: false },
},
});

createRoot(document.getElementById('root')!).render(
<StrictMode>
<Provider store={store}>
<ClerkProvider publishableKey={clerkPubKey}>
<QueryClientProvider client={queryClient}>
<App />
{process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
</QueryClientProvider>
</ClerkProvider>
</Provider>
</StrictMode>
);

Note : if you need more info on my frontend I'll be more than welcome to provide you

Please guide me how can I impliment Clerk (explain both the front end and backend part seperately )
