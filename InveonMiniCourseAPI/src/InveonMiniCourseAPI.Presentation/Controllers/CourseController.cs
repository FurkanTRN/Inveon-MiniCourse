using System.Net;
using InveonMiniCourseAPI.Application.DTOs.CourseDtos;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Presentation.Controllers;

[ApiController]
[Route("api/course")]
public class CourseController : Controller
{
    private readonly ICourseService _courseService;
    private readonly ILogger<CourseController> _logger;

    public CourseController(ICourseService courseService, ILogger<CourseController> logger)
    {
        _courseService = courseService;
        _logger = logger;
    }

    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Instructor")]
    public async Task<IActionResult> CreateCourseAsync([FromBody] CourseCreateDto courseCreateDto)
    {
        _logger.LogInformation("CreateCourseAsync endpoint called by instructor.");

        var result = await _courseService.CreateCourseAsync(courseCreateDto);

        if (result.Success)
        {
            _logger.LogInformation("Course created successfully: {CourseTitle}", courseCreateDto.Title);
            return Ok();
        }

        _logger.LogError("Failed to create course. Status: {StatusCode}, Message: {Message}",
            result.StatusCode, result.Message);
        return StatusCode((int)result.StatusCode, result.Message);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourseByIdAsync(long id)
    {
        _logger.LogInformation("GetCourseByIdAsync endpoint called for course ID: {CourseId}", id);

        var result = await _courseService.GetCourseByIdAsync(id);

        if (result.Success)
        {
            _logger.LogInformation("Retrieved course successfully for ID: {CourseId}", id);
            return Ok(result.Data);
        }

        _logger.LogError("Failed to retrieve course for ID: {CourseId}. Status: {StatusCode}, Message: {Message}",
            id, result.StatusCode, result.Message);
        return StatusCode((int)result.StatusCode, result.Message);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCoursesAsync(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortBy = "Alphabetical")
    {
        _logger.LogInformation(
            "GetAllCoursesAsync endpoint called. Page: {PageNumber}, PageSize: {PageSize}, SortBy: {SortBy}",
            pageNumber, pageSize, sortBy);

        var result = await _courseService.GetAllCoursesAsync(pageNumber, pageSize, sortBy);

        if (result.Success)
        {
            _logger.LogInformation("Retrieved all courses successfully. Count: {CourseCount}", result.Data);
            return Ok(result.Data);
        }

        _logger.LogError("Failed to retrieve courses. Status: {StatusCode}, Message: {Message}",
            result.StatusCode, result.Message);
        return StatusCode((int)result.StatusCode, result.Message);
    }

    [HttpPut("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Instructor")]
    public async Task<IActionResult> UpdateCourseAsync(long id, [FromBody] CourseUpdateDto courseUpdateDto)
    {
        _logger.LogInformation("UpdateCourseAsync endpoint called for course ID: {CourseId}", id);

        var result = await _courseService.UpdateCourseAsync(id, courseUpdateDto);

        if (result.Success)
        {
            _logger.LogInformation("Course updated successfully for ID: {CourseId}", id);
            return NoContent();
        }

        _logger.LogError("Failed to update course for ID: {CourseId}. Status: {StatusCode}, Message: {Message}",
            id, result.StatusCode, result.Message);
        return StatusCode((int)result.StatusCode, result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Instructor")]
    public async Task<IActionResult> DeleteCourseAsync(long id)
    {
        _logger.LogInformation("DeleteCourseAsync endpoint called for course ID: {CourseId}", id);

        var result = await _courseService.DeleteCourseAsync(id);

        if (result.Success)
        {
            _logger.LogInformation("Course deleted successfully for ID: {CourseId}", id);
            return NoContent();
        }

        _logger.LogError("Failed to delete course for ID: {CourseId}. Status: {StatusCode}, Message: {Message}",
            id, result.StatusCode, result.Message);
        return StatusCode((int)result.StatusCode, result.Message);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchCoursesByTitleAsync([FromQuery] SearchCourseDto searchCourseDto)
    {
        _logger.LogInformation("SearchCoursesByTitleAsync endpoint called. Query: {Query}", searchCourseDto.SearchTerm);

        var result = await _courseService.SearchCourseAsync(searchCourseDto);

        if (!result.Success)
        {
            _logger.LogError("Failed to search courses. Status: {StatusCode}, Message: {Message}",
                result.StatusCode, result.Message);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Courses searched successfully. Count: {CourseCount}", result.Data);
        return Ok(result.Data);
    }

    [HttpGet("instructor")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetInstructorCoursesAsync(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        _logger.LogInformation("GetInstructorCoursesAsync endpoint called. Page: {PageNumber}, PageSize: {PageSize}",
            pageNumber, pageSize);

        var result = await _courseService.GetInstructorCoursesAsync(pageNumber, pageSize);

        if (!result.Success)
        {
            _logger.LogError("Failed to retrieve instructor courses. Status: {StatusCode}, Message: {Message}",
                result.StatusCode, result.Message);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Retrieved instructor courses successfully. Count: {CourseCount}", result.Data);
        return Ok(result.Data);
    }
}