namespace InveonMiniCourseAPI.Application.DTOs.CourseDtos;

public class CourseDto
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ImagePath { get; set; }
    public long CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string InstructorName { get; set; }
    
    public long InstructorId { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}