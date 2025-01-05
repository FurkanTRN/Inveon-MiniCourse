using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InveonMiniCourseAPI.Application.DTOs.AuthDto;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace InveonMiniCourseAPI.Application.Services;

public class TokenService : ITokenService
{
    private readonly IConfigurationSection _jwtSettings;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<TokenService> _logger;

    public TokenService(
        IConfiguration configuration,
        UserManager<AppUser> userManager,
        IUnitOfWork unitOfWork,
        ILogger<TokenService> logger)
    {
        _userManager = userManager;
        _unitOfWork = unitOfWork;
        _jwtSettings = configuration.GetSection("JwtSettings");
        _logger = logger;
    }

    public async Task<TokenDto> GenerateAccessToken(AppUser user)
    {
        _logger.LogInformation("Generating access token for user: {Email}", user.Email);

        var jwtTokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSettings["SecretKey"]);

        // Create claims for the token
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Name, $"{user.FirstName} {user.LastName}")
        };

        // Add user roles to claims
        var userRoles = await _userManager.GetRolesAsync(user);
        claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

        // Create token descriptor
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.GetValue<int>("AccessTokenExpireMinute")),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            ),
            NotBefore = DateTime.UtcNow
        };

        var token = jwtTokenHandler.CreateToken(tokenDescriptor);

        var refreshToken = GenerateRefreshToken();
        user.RefreshTokens.Add(refreshToken);

        await _userManager.UpdateAsync(user);
        await _unitOfWork.SaveAsync();

        _logger.LogInformation("Access token and refresh token generated for user: {Email}", user.Email);

        return new TokenDto
        {
            AccessToken = jwtTokenHandler.WriteToken(token),
            RefreshToken = refreshToken.Token,
            Expiration = refreshToken.ExpiryDate
        };
    }

    private RefreshToken GenerateRefreshToken()
    {
        return new RefreshToken
        {
            Token = Guid.NewGuid().ToString(),
            ExpiryDate = DateTime.UtcNow.AddDays(_jwtSettings.GetValue<int>("RefreshTokenExpireDay")),
            CreatedDate = DateTime.UtcNow
        };
    }

    public async Task<TokenDto> RefreshTokenAsync(string accessToken, string refreshToken)
    {
        _logger.LogInformation("Refreshing token for access token: {AccessToken}", accessToken);

        var principal = GetPrincipalFromExpiredToken(accessToken);
        var email = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            _logger.LogWarning("Email claim not found in access token.");
            throw new SecurityTokenException("Invalid access token: Email claim not found.");
        }

        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            _logger.LogWarning("User not found for email: {Email}", email);
            throw new SecurityTokenException("Invalid access token: User not found.");
        }

        var existingRefreshToken = user.RefreshTokens
            .SingleOrDefault(rt => rt.Token == refreshToken);

        if (existingRefreshToken == null)
        {
            _logger.LogWarning("Refresh token not found: {RefreshToken}", refreshToken);
            throw new SecurityTokenException("Invalid refresh token: Token not found.");
        }

        if (!existingRefreshToken.IsActive)
        {
            _logger.LogWarning("Refresh token is not active: {RefreshToken}", refreshToken);
            throw new SecurityTokenException("Refresh token expired or revoked.");
        }

        existingRefreshToken.RevokedDate = DateTime.UtcNow;

        await _userManager.UpdateAsync(user);
        await _unitOfWork.SaveAsync();

        _logger.LogInformation("Refresh token revoked and new token generated for user: {Email}", email);

        return await GenerateAccessToken(user);
    }

    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var key = Encoding.ASCII.GetBytes(_jwtSettings["SecretKey"]);

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true, 
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = false 
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

        if (securityToken is not JwtSecurityToken jwtSecurityToken ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                StringComparison.InvariantCultureIgnoreCase))
        {
            _logger.LogWarning("Invalid token format or algorithm.");
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }
}