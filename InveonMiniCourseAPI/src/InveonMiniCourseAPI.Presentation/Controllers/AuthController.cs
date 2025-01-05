using System.Net;
using InveonMiniCourseAPI.Application.DTOs;
using InveonMiniCourseAPI.Application.DTOs.AuthDto;
using InveonMiniCourseAPI.Application.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Presentation.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthService authService,
        ITokenService tokenService,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _tokenService = tokenService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        _logger.LogInformation("Register endpoint called for user: {Email}", registerDto.Email);

        var result = await _authService.RegisterAsync(registerDto);

        if (result.StatusCode == HttpStatusCode.OK)
        {
            _logger.LogInformation("User registered successfully: {Email}", registerDto.Email);
            return Ok(new { result.Message });
        }

        _logger.LogError("User registration failed for {Email}. Status: {StatusCode}, Details: {ProblemDetails}",
            registerDto.Email, result.StatusCode, result.ProblemDetails);
        return StatusCode((int)result.StatusCode, result.ProblemDetails);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        _logger.LogInformation("Login endpoint called for user: {Email}", loginDto.Email);

        var result = await _authService.LoginAsync(loginDto);

        if (result.StatusCode == HttpStatusCode.OK)
        {
            _logger.LogInformation("User logged in successfully: {Email}", loginDto.Email);
            return Ok(result);
        }

        _logger.LogError("Login failed for {Email}. Status: {StatusCode}, Details: {ProblemDetails}",
            loginDto.Email, result.StatusCode, result.ProblemDetails);
        return StatusCode((int)result.StatusCode, result.ProblemDetails);
    }

    [HttpPost("update-password")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto updatePasswordDto)
    {
        _logger.LogInformation("UpdatePassword endpoint called for user.");

        var result = await _authService.UpdatePasswordAsync(updatePasswordDto);

        if (result.StatusCode == HttpStatusCode.NoContent)
        {
            _logger.LogInformation("Password updated successfully.");
            return NoContent();
        }

        _logger.LogError("Password update failed. Status: {StatusCode}, Details: {ProblemDetails}",
            result.StatusCode, result.ProblemDetails);
        return StatusCode((int)result.StatusCode, result.ProblemDetails);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto dto)
    {
        _logger.LogInformation("RefreshToken endpoint called.");

        try
        {
            var token = await _tokenService.RefreshTokenAsync(dto.AccessToken, dto.RefreshToken);
            _logger.LogInformation("Token refreshed successfully.");
            return Ok(token);
        }
        catch (SecurityTokenException ex)
        {
            _logger.LogError(ex, "Token refresh failed: {ErrorMessage}", ex.Message);
            return BadRequest(ex.Message);
        }
    }
}