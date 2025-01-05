using InveonMiniCourseAPI.Application.DTOs.CategoryDtos;
using InveonMiniCourseAPI.Application.DTOs.CourseDtos;

namespace InveonMiniCourseAPI.Application.Interfaces;

public interface ICategoryService
{
   Task<ServiceResult<List<CategoryDto>>> GetAllCategoriesAsync();

    Task<ServiceResult<AllCourseDto>> GetCategoryWithCoursesByIdAsync(long id,CategoryRequest categoryRequest);
}