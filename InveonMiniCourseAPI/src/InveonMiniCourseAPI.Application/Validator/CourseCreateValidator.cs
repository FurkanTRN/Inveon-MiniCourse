using FluentValidation;
using InveonMiniCourseAPI.Application.DTOs.CourseDtos;

namespace InveonMiniCourseAPI.Application.Validator;

public class CourseCreateValidator : AbstractValidator<CourseCreateDto>
{
    public CourseCreateValidator()
    {
        RuleFor(x => x.Title).NotEmpty().NotNull().WithMessage("Title is required").MinimumLength(10)
            .WithMessage("Title must be at least 10 characters");
        RuleFor(x => x.Description).NotEmpty().NotNull().WithMessage("Description is required").Length(10, 150)
            .WithMessage("Description must be between 10 and 150 characters");
        RuleFor(x => x.Price).NotEmpty().NotNull().GreaterThan(0).WithMessage("Price is required and must be greater than 0");
        RuleFor(x => x.CategoryId).NotEmpty().NotNull().WithMessage("CategoryId is required");
    }
}