using InveonMiniCourseAPI.Application.DTOs;

namespace InveonMiniCourseAPI.Application.Interfaces;

public interface IUserService
{
    Task<ServiceResult> UpdateUserAsync(UserUpdateDto userUpdateDto);
    Task<ServiceResult> DeleteUserAsync();
    Task<ServiceResult<UserDto>> GetUserByEmailAsync();
}