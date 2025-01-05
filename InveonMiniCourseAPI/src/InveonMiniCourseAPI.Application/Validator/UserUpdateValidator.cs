using FluentValidation;
using InveonMiniCourseAPI.Application.DTOs;

namespace InveonMiniCourseAPI.Application.Validator;

public class UserUpdateValidator : AbstractValidator<UserUpdateDto>
{
    public UserUpdateValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().Length(3, 20)
            .WithMessage("First name must be between 3 and 20 characters.");
        RuleFor(x => x.LastName).NotEmpty().Length(3, 20).WithMessage("Last name must be between 3 and 20 characters.");
        RuleFor(x => x.AvatarPath).MaximumLength(255);
    }
}