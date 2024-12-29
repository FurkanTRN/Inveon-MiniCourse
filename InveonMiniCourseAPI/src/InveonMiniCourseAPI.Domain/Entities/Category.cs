namespace InveonMiniCourseAPI.Domain.Entities;

public class Category
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    public ICollection<Course> Courses { get; set; } = new HashSet<Course>();
}