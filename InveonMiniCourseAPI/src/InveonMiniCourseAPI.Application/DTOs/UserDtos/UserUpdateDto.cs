namespace InveonMiniCourseAPI.Application.DTOs;

public class UserUpdateDto
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? AvatarPath { get; set; }
    
    public string Email { get; set; } = null!;
}