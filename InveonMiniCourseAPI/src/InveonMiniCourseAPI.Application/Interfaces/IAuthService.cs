using InveonMiniCourseAPI.Application.DTOs;
using InveonMiniCourseAPI.Application.DTOs.AuthDto;
using InveonMiniCourseAPI.Domain.Entities;

namespace InveonMiniCourseAPI.Application.Interfaces;

public interface IAuthService
{
    Task<ServiceResult> RegisterAsync(RegisterDto registerDto);
    Task<ServiceResult<TokenDto>> LoginAsync(LoginDto loginDto);

    Task<ServiceResult> UpdatePasswordAsync(UpdatePasswordDto updatePasswordDto);
}