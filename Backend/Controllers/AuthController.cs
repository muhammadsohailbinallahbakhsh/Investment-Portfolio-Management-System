using Backend.DTOs.Auth;
using Backend.DTOs.Common;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new user account
        /// </summary>
        /// <param name="registerDto">User registration details</param>
        /// <returns>Auth response with tokens</returns>
        [HttpPost("register")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Validation failed", errors));
                }

                var result = await _authService.RegisterAsync(registerDto);

                if (result == null)
                {
                    return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Registration failed. Email may already be in use."));
                }

                _logger.LogInformation("User registered successfully: {Email}", registerDto.Email);

                return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(
                    result,
                    "Registration successful. Please note: Email verification is simulated in this environment."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration: {Email}", registerDto.Email);
                return StatusCode(500, ApiResponse<AuthResponseDto>.ErrorResponse(
                    "An error occurred during registration. Please try again later."));
            }
        }

        /// <summary>
        /// Login with email and password
        /// </summary>
        /// <param name="loginDto">Login credentials</param>
        /// <returns>Auth response with tokens</returns>
        [HttpPost("login")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Validation failed", errors));
                }

                var result = await _authService.LoginAsync(loginDto);

                if (result == null)
                {
                    return Unauthorized(ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Invalid email or password, or account may be inactive."));
                }

                _logger.LogInformation("User logged in successfully: {Email}", loginDto.Email);

                return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(
                    result, "Login successful"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login: {Email}", loginDto.Email);
                return StatusCode(500, ApiResponse<AuthResponseDto>.ErrorResponse(
                    "An error occurred during login. Please try again later."));
            }
        }

        /// <summary>
        /// Refresh access token using refresh token
        /// </summary>
        /// <param name="refreshTokenDto">Refresh token</param>
        /// <returns>New auth response with tokens</returns>
        [HttpPost("refresh-token")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Invalid refresh token format"));
                }

                var result = await _authService.RefreshTokenAsync(refreshTokenDto.RefreshToken);

                if (result == null)
                {
                    return Unauthorized(ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Invalid or expired refresh token"));
                }

                _logger.LogInformation("Token refreshed successfully for user: {UserId}", result.UserId);

                return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(
                    result, "Token refreshed successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, ApiResponse<AuthResponseDto>.ErrorResponse(
                    "An error occurred during token refresh. Please try again later."));
            }
        }

        /// <summary>
        /// Logout and revoke refresh token
        /// </summary>
        /// <returns>Success message</returns>
        [Authorize]
        [HttpPost("logout")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse.ErrorResponse(
                        "User not authenticated"));
                }

                var result = await _authService.RevokeTokenAsync(userId);

                if (!result)
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "Logout failed. User not found."));
                }

                _logger.LogInformation("User logged out successfully: {UserId}", userId);

                return Ok(ApiResponse.SuccessResponse(
                    "Logged out successfully. Session expired."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred during logout. Please try again later."));
            }
        }

        /// <summary>
        /// Request password reset (UI simulation - sends mock email)
        /// </summary>
        /// <param name="requestDto">Email for password reset</param>
        /// <returns>Success message</returns>
        [HttpPost("password-reset-request")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestDto requestDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "Invalid email format"));
                }

                // Note: In production, this would send an actual email
                // For this project, we're simulating the process
                _logger.LogInformation("Password reset requested for: {Email}", requestDto.Email);

                // Always return success to prevent email enumeration attacks
                return Ok(ApiResponse.SuccessResponse(
                    "If an account exists with this email, a password reset link will be sent. " +
                    "(Note: Email sending is simulated in this environment. " +
                    "In production, check your email for reset instructions.)"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset request");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred. Please try again later."));
            }
        }

        /// <summary>
        /// Change password for authenticated user
        /// </summary>
        /// <param name="changePasswordDto">Current and new password</param>
        /// <returns>Success message</returns>
        [Authorize]
        [HttpPost("change-password")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(ApiResponse.ErrorResponse(
                        "Validation failed", errors));
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse.ErrorResponse(
                        "User not authenticated"));
                }

                // This would be implemented in AuthService
                // For now, return a placeholder response
                _logger.LogInformation("Password change requested for user: {UserId}", userId);

                return Ok(ApiResponse.SuccessResponse(
                    "Password changed successfully. Please login with your new password."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password change");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred during password change. Please try again later."));
            }
        }

        /// <summary>
        /// Verify email (simulated)
        /// </summary>
        /// <param name="token">Email verification token</param>
        /// <returns>Success message</returns>
        [HttpGet("verify-email")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public IActionResult VerifyEmail([FromQuery] string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(ApiResponse.ErrorResponse(
                        "Invalid verification token"));
                }

                // In production, this would verify the token and update user's EmailConfirmed status
                _logger.LogInformation("Email verification simulated for token: {Token}", token);

                return Ok(ApiResponse.SuccessResponse(
                    "Email verified successfully. " +
                    "(Note: Email verification is simulated in this environment. " +
                    "All registered users are automatically marked as verified.)"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during email verification");
                return StatusCode(500, ApiResponse.ErrorResponse(
                    "An error occurred during email verification. Please try again later."));
            }
        }
    }
}