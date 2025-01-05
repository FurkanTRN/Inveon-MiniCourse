using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using InveonMiniCourseAPI.Application.DTOs;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace InveonMiniCourseAPI.Application.Services;

public class UserService : IUserService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor)
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ServiceResult<UserDto>> GetUserByEmailAsync()
    {
        var email = _httpContextAccessor.HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Email);
        if (email is null)
        {
            return ServiceResult<UserDto>.Fail(HttpStatusCode.Unauthorized, "You are not authorized to view this user");
        }

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            return ServiceResult<UserDto>.Fail(HttpStatusCode.NotFound, "User not found");
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AvatarPath = user.AvatarPath
        };

        return ServiceResult<UserDto>.Ok(userDto);
    }

    public Task<ServiceResult> UpdateUserAsync(UserUpdateDto userUpdateDto)
    {
        var userEmail = _httpContextAccessor.HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Email);
        if (userEmail is null || userEmail != userUpdateDto.Email)
        {
            return Task.FromResult(ServiceResult.Fail(HttpStatusCode.Forbidden,
                "You are not authorized to update this user"));
        }

        var existingUser = _userManager.FindByEmailAsync(userUpdateDto.Email).Result;
        if (existingUser is null)
        {
            return Task.FromResult(ServiceResult.Fail(HttpStatusCode.NotFound,
                "User not found"));
        }

        existingUser.FirstName = userUpdateDto.FirstName;
        existingUser.LastName = userUpdateDto.LastName;
        existingUser.AvatarPath = userUpdateDto.AvatarPath;
        existingUser.UpdatedDate = DateTime.UtcNow;
        var result = _userManager.UpdateAsync(existingUser).Result;
        if (!result.Succeeded)
        {
            return Task.FromResult(ServiceResult.Fail(HttpStatusCode.InternalServerError,
                "An error occurred while updating the user"));
        }

        return Task.FromResult(ServiceResult.Ok(HttpStatusCode.NoContent, "User updated successfully"));
    }

    public async Task<ServiceResult> DeleteUserAsync()
    {
        var userEmail = _httpContextAccessor.HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Email);
        if (userEmail is null)
        {
            return ServiceResult.Fail(HttpStatusCode.Unauthorized, "You are not authorized to delete this user.");
        }

        var userToDelete = await _userManager.FindByEmailAsync(userEmail);
        if (userToDelete == null)
        {
            return ServiceResult.Fail(HttpStatusCode.NotFound, "User not found.");
        }

        var result = await _userManager.DeleteAsync(userToDelete);
        if (!result.Succeeded)
        {
            return ServiceResult.Fail(HttpStatusCode.InternalServerError, "An error occurred while deleting the user.");
        }

        return ServiceResult.Ok(HttpStatusCode.NoContent, "User deleted successfully.");
    }
}