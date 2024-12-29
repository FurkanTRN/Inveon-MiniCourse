using Microsoft.AspNetCore.Identity;

namespace InveonMiniCourseAPI.Domain.Entities;

public class AppUser : IdentityUser<long>
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? AvatarPath { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
}