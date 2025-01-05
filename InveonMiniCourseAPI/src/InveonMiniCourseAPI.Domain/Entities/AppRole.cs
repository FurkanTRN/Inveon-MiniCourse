using Microsoft.AspNetCore.Identity;

namespace InveonMiniCourseAPI.Domain.Entities;

public class AppRole : IdentityRole<long>
{
    public DateTime CreatedAt { get; set; } 
    public DateTime UpdatedAt { get; set; } 
}