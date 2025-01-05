using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Transactions;
using InveonMiniCourseAPI.Application.DTOs;
using InveonMiniCourseAPI.Application.DTOs.AuthDto;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace InveonMiniCourseAPI.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(UserManager<AppUser> userManager, IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor, ITokenService tokenService, IUnitOfWork unitOfWork)
    {
        _userManager = userManager;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<ServiceResult> RegisterAsync(RegisterDto registerDto)
    {
        using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        try
        {
            var user = new AppUser
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                AvatarPath = "default.png"
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                return ServiceResult.Fail(HttpStatusCode.BadRequest, "User registration failed.", new ProblemDetails
                {
                    Title = "Registration Error",
                    Detail = string.Join(", ", result.Errors.Select(e => e.Description))
                });
            }

            var addRoleResult = await _userManager.AddToRoleAsync(user, "Student");
            if (!addRoleResult.Succeeded)
            {
                return ServiceResult.Fail(HttpStatusCode.BadRequest, "Failed to assign role to the user.",
                    new ProblemDetails
                    {
                        Title = "Role Assignment Error",
                        Detail = string.Join(", ", addRoleResult.Errors.Select(e => e.Description))
                    });
            }

            scope.Complete();
            return ServiceResult.Ok(HttpStatusCode.Created, "User registered successfully.");
        }
        catch (Exception ex)
        {
            return ServiceResult.Fail(HttpStatusCode.InternalServerError, "An error occurred.", new ProblemDetails
            {
                Title = "Unexpected Error",
                Detail = ex.Message
            });
        }
    }

    public async Task<ServiceResult<TokenDto>> LoginAsync(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return ServiceResult<TokenDto>.Fail(HttpStatusCode.Unauthorized, "Invalid login attempt.");
        }

        var accessToken = await _tokenService.GenerateAccessToken(user);
        return ServiceResult<TokenDto>.Ok(accessToken);
    }

    public async Task<ServiceResult> UpdatePasswordAsync(UpdatePasswordDto updatePasswordDto)
    {
        var userEmail = _httpContextAccessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
        {
            return ServiceResult.Fail(HttpStatusCode.Unauthorized, "User not authenticated.");
        }

        var existingUser = await _userManager.FindByEmailAsync(userEmail);
        if (existingUser == null)
        {
            return ServiceResult.Fail(HttpStatusCode.NotFound, "User not found.");
        }

        var isCurrentPasswordValid =
            await _userManager.CheckPasswordAsync(existingUser, updatePasswordDto.CurrentPassword);
        if (!isCurrentPasswordValid)
        {
            return ServiceResult.Fail(HttpStatusCode.BadRequest, "Current password is incorrect.");
        }

        var result = await _userManager.ChangePasswordAsync(existingUser, updatePasswordDto.CurrentPassword,
            updatePasswordDto.NewPassword);
        return !result.Succeeded
            ? ServiceResult.Fail(HttpStatusCode.BadRequest, "Password update failed.", new ProblemDetails
            {
                Title = "Password Update Error",
                Detail = string.Join(", ", result.Errors.Select(e => e.Description))
            })
            : ServiceResult.Ok(HttpStatusCode.NoContent, "Password updated successfully.");
    }
}