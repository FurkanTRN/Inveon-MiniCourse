namespace InveonMiniCourseAPI.Application.DTOs.AuthDto;

public class RefreshTokenRequestDto
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}
