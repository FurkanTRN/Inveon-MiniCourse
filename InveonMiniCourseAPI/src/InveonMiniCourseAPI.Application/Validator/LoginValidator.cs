using FluentValidation;
using InveonMiniCourseAPI.Application.DTOs;

namespace InveonMiniCourseAPI.Application.Validator;

public class LoginValidator : AbstractValidator<LoginDto>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required");
        RuleFor(x => x.Password).NotEmpty().MinimumLength(2).WithMessage("Password is required");
    }
}