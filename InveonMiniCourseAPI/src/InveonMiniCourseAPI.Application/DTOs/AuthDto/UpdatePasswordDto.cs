﻿namespace InveonMiniCourseAPI.Application.DTOs.AuthDto;

public class UpdatePasswordDto
{
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}