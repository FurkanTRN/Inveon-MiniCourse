using System.Security.Claims;
using InveonMiniCourseAPI.Application.DTOs.AuthDto;
using InveonMiniCourseAPI.Domain.Entities;

namespace InveonMiniCourseAPI.Application.Interfaces;

public interface ITokenService
{
    Task<TokenDto> GenerateAccessToken(AppUser user);
    Task<TokenDto> RefreshTokenAsync(string accessToken, string refreshToken);
}