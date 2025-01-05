using InveonMiniCourseAPI.Application.DTOs.CourseDtos;

namespace InveonMiniCourseAPI.Application.DTOs.CategoryDtos;

public class CategoryWithCoursesDto
{
    public long Id { get; set; }
    public string Name { get; set; }
    public List<CourseDto> Courses { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public int TotalCourses { get; set; }
}