namespace InveonMiniCourseAPI.Application.DTOs.CourseDtos;

public class CourseUpdateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ImagePath { get; set; }
    public long CategoryId { get; set; }
}