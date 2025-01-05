using System.Net;
using InveonMiniCourseAPI.Application.DTOs.CategoryDtos;
using InveonMiniCourseAPI.Application.DTOs.CourseDtos;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace InveonMiniCourseAPI.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }


    public async Task<ServiceResult<List<CategoryDto>>> GetAllCategoriesAsync()
    {
        var categories = await _unitOfWork.Categories.AsNoTracking().ToListAsync();
        if (!categories.Any())
        {
            return ServiceResult<List<CategoryDto>>.Fail(HttpStatusCode.NotFound, "Categories not found");
        }

        var categoryDtos = categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
        }).ToList();
        return ServiceResult<List<CategoryDto>>.Ok(categoryDtos);
    }

    public async Task<ServiceResult<AllCourseDto>> GetCategoryWithCoursesByIdAsync(long id,
        CategoryRequest categoryRequest)
    {
        if (categoryRequest is null || id == 0)
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.BadRequest, "Invalid category request");
        }

        if (!Enum.TryParse<CourseSortBy>(categoryRequest.SortOrder, true, out var sortByEnum))
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.BadRequest, "Invalid sorting parameter");
        }

        var coursesQuery = _unitOfWork.Courses
            .Include(c => c.Category)
            .Include(c => c.Instructor)
            .AsNoTracking()
            .Where(c => c.Category.Id == id);

        var sortedQuery = sortByEnum switch
        {
            CourseSortBy.Alphabetical => coursesQuery.OrderBy(c => c.Title),
            CourseSortBy.PriceLowToHigh => coursesQuery.OrderBy(c => c.Price),
            CourseSortBy.PriceHighToLow => coursesQuery.OrderByDescending(c => c.Price),
            CourseSortBy.Newest => coursesQuery.OrderByDescending(c => c.CreatedDate),
            _ => coursesQuery.OrderBy(c => c.Title)
        };

        var courses = await sortedQuery
            .Skip((categoryRequest.PageNumber - 1) * categoryRequest.PageSize)
            .Take(categoryRequest.PageSize)
            .ToListAsync();

        if (!courses.Any())
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.NotFound, "No courses found on category request.");
        }

        var totalRecords = await coursesQuery.CountAsync();
        var totalPages = (int)Math.Ceiling(totalRecords / (double)categoryRequest.PageSize);

        var courseDtos = courses.Select(course => new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Price = course.Price,
            CategoryName = course.Category.Name,
            InstructorName = course.Instructor.FirstName + " " + course.Instructor.LastName,
            ImagePath = course.ImagePath,
            CreatedDate = course.CreatedDate,
            UpdatedDate = course.UpdatedDate
        }).ToList();

        var result = new AllCourseDto
        {
            PageSize = categoryRequest.PageSize,
            PageNumber = categoryRequest.PageNumber,
            TotalPage = totalPages,
            TotalRecord = totalRecords,
            Courses = courseDtos
        };

        return ServiceResult<AllCourseDto>.Ok(result);
    }
}