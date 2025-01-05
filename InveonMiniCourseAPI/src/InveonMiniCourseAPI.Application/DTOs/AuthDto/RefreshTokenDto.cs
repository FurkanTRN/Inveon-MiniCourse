namespace InveonMiniCourseAPI.Application.DTOs;

public record RefreshTokenDto
{
    public string RefreshToken { get; set; } = null!;
}