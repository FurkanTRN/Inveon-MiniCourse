using InveonMiniCourseAPI.Application.DTOs.CategoryDtos;
using InveonMiniCourseAPI.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Presentation.Controllers;

[ApiController]
[Route("api/category")]
public class CategoryController : Controller
{
    private readonly ICategoryService _categoryService;
    private readonly ILogger<CategoryController> _logger;

    public CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger)
    {
        _categoryService = categoryService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        _logger.LogInformation("GetAllCategories endpoint called.");

        var result = await _categoryService.GetAllCategoriesAsync();

        if (result.Success)
        {
            _logger.LogInformation("Retrieved all categories successfully. Count: {CategoryCount}", result.Data?.Count);
            return Ok(result.Data);
        }

        _logger.LogError("Failed to retrieve categories. Message: {ErrorMessage}", result.Message);
        return NotFound(result.Message);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryWithCoursesById([FromRoute] long id,
        [FromQuery] CategoryRequest categoryRequest)
    {
        _logger.LogInformation("GetCategoryWithCoursesById endpoint called for category ID: {CategoryId}", id);

        var result = await _categoryService.GetCategoryWithCoursesByIdAsync(id, categoryRequest);

        if (result.Success)
        {
            _logger.LogInformation("Retrieved category with courses successfully for ID: {CategoryId}", id);
            return Ok(result.Data);
        }

        _logger.LogError("Failed to retrieve category with courses for ID: {CategoryId}. Message: {ErrorMessage}", id, result.Message);
        return NotFound(result.Message);
    }
}