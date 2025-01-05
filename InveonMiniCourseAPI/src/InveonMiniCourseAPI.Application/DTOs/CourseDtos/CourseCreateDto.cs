namespace InveonMiniCourseAPI.Application.DTOs.CourseDtos;

public class CourseCreateDto
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public long CategoryId { get; set; }
    public string? ImagePath { get; set; }
}