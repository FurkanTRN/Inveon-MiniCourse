using InveonMiniCourseAPI.Application.DTOs;
using InveonMiniCourseAPI.Application.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Presentation.Controllers;

[ApiController]
[Route("api/user/")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class UserController : Controller
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(
        IUserService userService,
        ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetUserByEmail()
    {
        _logger.LogInformation("GetUserByEmail endpoint called.");

        var result = await _userService.GetUserByEmailAsync();

        if (result.Success)
        {
            _logger.LogInformation("User retrieved successfully.");
            return Ok(result.Data);
        }

        _logger.LogError("Failed to retrieve user. Status: {StatusCode}, Message: {Message}",
            result.StatusCode, result.Message);
        return StatusCode((int)result.StatusCode, result.Message);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDto userUpdateDto)
    {
        _logger.LogInformation("UpdateUser endpoint called.");

        var result = await _userService.UpdateUserAsync(userUpdateDto);

        if (result.Success)
        {
            _logger.LogInformation("User updated successfully.");
            return NoContent();
        }

        _logger.LogError("Failed to update user. Status: {StatusCode}, Message: {Message}",
            result.StatusCode, result.Message);
        return StatusCode((int)result.StatusCode, result.Message);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteUser()
    {
        _logger.LogInformation("DeleteUser endpoint called.");

        var result = await _userService.DeleteUserAsync();

        if (result.Success)
        {
            _logger.LogInformation("User deleted successfully.");
            return NoContent();
        }

        _logger.LogError("Failed to delete user. Status: {StatusCode}, Message: {Message}",
            result.StatusCode, result.Message);
        return StatusCode((int)result.StatusCode, result.Message);
    }
}