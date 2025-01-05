﻿namespace InveonMiniCourseAPI.Application.DTOs.AuthDto;

public class TokenDto
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime Expiration { get; set; }
}