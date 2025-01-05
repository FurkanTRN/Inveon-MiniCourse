namespace InveonMiniCourseAPI.Application.DTOs;

public record UserDto
{
    public long Id { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
    public string AvatarPath { get; init; }
    public DateTime CreatedDate { get; init; }
    public DateTime? UpdatedDate { get; init; }
    public string Email { get; init; }
}