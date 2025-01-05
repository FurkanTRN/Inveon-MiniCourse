namespace InveonMiniCourseAPI.Domain.Entities;

public class Course
{
    public long Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; }
    public string? ImagePath { get; set; }
    public decimal Price { get; set; }
    public long CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    
    public long InstructorId { get; set; }
    public AppUser Instructor { get; set; } = null!;
    
    public ICollection<OrderCourse> OrderCourses { get; set; } = new HashSet<OrderCourse>();
    public ICollection<UserCourse> EnrolledUsers { get; set; } = new HashSet<UserCourse>();
}