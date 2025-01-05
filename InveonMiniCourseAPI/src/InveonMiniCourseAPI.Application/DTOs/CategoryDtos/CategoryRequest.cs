using InveonMiniCourseAPI.Application.DTOs.CourseDtos;

namespace InveonMiniCourseAPI.Application.DTOs.CategoryDtos;

public class CategoryRequest
{
    public int PageSize { get; set; }
    public int PageNumber { get; set; }
    public string SortOrder { get; set; } = "Newest";
}