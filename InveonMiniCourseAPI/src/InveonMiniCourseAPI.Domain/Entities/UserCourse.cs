namespace InveonMiniCourseAPI.Domain.Entities;

public class UserCourse
{
    public long UserId { get; set; }
    public AppUser User { get; set; } = null!;
    
    public long CourseId { get; set; }
    public Course Course { get; set; } = null!;
    
    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow; 
}