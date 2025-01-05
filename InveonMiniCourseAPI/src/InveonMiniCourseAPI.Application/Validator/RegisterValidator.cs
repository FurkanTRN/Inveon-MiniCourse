using FluentValidation;
using InveonMiniCourseAPI.Application.DTOs;

namespace InveonMiniCourseAPI.Application.Validator;

public class RegisterValidator : AbstractValidator<RegisterDto>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required")
            .Matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,15}$")
            .WithMessage(
                "Password must be between 8 and 15 characters and contain at least one uppercase letter, one lowercase letter, and one number");
        RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name is required").Length(3, 20)
            .WithMessage("First name must be between 3 and 20 characters");
        RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name is required").Length(3, 20)
            .WithMessage("Last name must be between 3 and 20 characters");
    }
}