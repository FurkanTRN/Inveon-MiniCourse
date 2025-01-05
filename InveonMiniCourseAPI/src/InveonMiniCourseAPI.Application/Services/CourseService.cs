using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using InveonMiniCourseAPI.Application.DTOs.CourseDtos;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InveonMiniCourseAPI.Application.Services;

public class CourseService : ICourseService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;

    public CourseService(IHttpContextAccessor httpContextAccessor, IUnitOfWork unitOfWork, ICacheService cacheService)
    {
        _httpContextAccessor = httpContextAccessor;
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
    }

    public async Task<ServiceResult> CreateCourseAsync(CourseCreateDto courseCreateDto)
    {
        var instructorId = _httpContextAccessor.HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (instructorId is null)
            return await Task.FromResult(ServiceResult.Fail(HttpStatusCode.Unauthorized, "Unauthorized user"));

        var course = new Course
        {
            Title = courseCreateDto.Title,
            Description = courseCreateDto.Description,
            Price = courseCreateDto.Price,
            CategoryId = courseCreateDto.CategoryId,
            ImagePath = courseCreateDto.ImagePath,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow,
            InstructorId = long.Parse(instructorId)
        };
        await _unitOfWork.Courses.AddAsync(course);
        var result = await _unitOfWork.SaveAsync();

        if (result > 0)
        {
            await _cacheService.RemoveAsync("courses:*");
            return ServiceResult.Ok(HttpStatusCode.Created, "Course created successfully.");
        }

        return ServiceResult.Fail(HttpStatusCode.InternalServerError, "Failed to create course.");
    }

    public async Task<ServiceResult<CourseDto>> GetCourseByIdAsync(long id)
    {
        var course = await _unitOfWork.Courses.Include(c => c.Category).Include(c => c.Instructor)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (course is null)
        {
            return ServiceResult<CourseDto>.Fail(HttpStatusCode.NotFound, $"Course with id {id} not found.");
        }

        return ServiceResult<CourseDto>.Ok(
            new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                CategoryName = course.Category.Name,
                CategoryId = course.Category.Id,
                ImagePath = course.ImagePath,
                InstructorId = course.InstructorId,
                InstructorName = course.Instructor.FirstName + " " + course.Instructor.LastName,
                CreatedDate = course.CreatedDate,
                UpdatedDate = course.UpdatedDate
            });
    }

    public async Task<ServiceResult<AllCourseDto>> GetAllCoursesAsync(int pageNumber, int pageSize, string sortBy)
    {
        if (!Enum.TryParse<CourseSortBy>(sortBy, true, out var sortByEnum))
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.BadRequest, "Invalid sorting parameter");
        }

        string cacheKey = $"courses:page={pageNumber}:size={pageSize}:sort={sortBy}";

        var cachedResult = await _cacheService.GetAsync<AllCourseDto>(cacheKey);
        if (cachedResult is not null)
        {
            return ServiceResult<AllCourseDto>.Ok(cachedResult);
        }

        var query = _unitOfWork.Courses
            .Include(c => c.Category)
            .Include(c => c.Instructor)
            .AsNoTracking();

        query = sortByEnum switch
        {
            CourseSortBy.Alphabetical => query.OrderBy(c => c.Title),
            CourseSortBy.PriceLowToHigh => query.OrderBy(c => c.Price),
            CourseSortBy.PriceHighToLow => query.OrderByDescending(c => c.Price),
            CourseSortBy.Newest => query.OrderByDescending(c => c.CreatedDate),
            _ => query.OrderBy(c => c.Title)
        };

        var totalRecords = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

        var courses = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        if (!courses.Any())
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.NotFound, "Courses not found");
        }

        var courseDtos = courses.Select(course => new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Price = course.Price,
            CategoryName = course.Category.Name,
            CategoryId = course.Category.Id,
            InstructorName = course.Instructor.FirstName + " " + course.Instructor.LastName,
            ImagePath = course.ImagePath,
            CreatedDate = course.CreatedDate,
            UpdatedDate = course.UpdatedDate
        }).ToList();

        var result = new AllCourseDto
        {
            PageSize = pageSize,
            PageNumber = pageNumber,
            TotalPage = totalPages,
            TotalRecord = totalRecords,
            Courses = courseDtos
        };

        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(30));

        return ServiceResult<AllCourseDto>.Ok(result);
    }

    public async Task<ServiceResult> UpdateCourseAsync(long id, CourseUpdateDto courseUpdateDto)
    {
        var course = await _unitOfWork.Courses.Include(c => c.Instructor).Include(c => c.Category)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (course is null)
        {
            return ServiceResult.Fail(HttpStatusCode.NotFound, $"Course with id {id} not found.");
        }

        var instructorId = _httpContextAccessor.HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (instructorId is null || course.InstructorId.ToString() != instructorId)
        {
            return ServiceResult.Fail(HttpStatusCode.Unauthorized, "Unauthorized user");
        }

        course.Title = courseUpdateDto.Title;
        course.Description = courseUpdateDto.Description;
        course.Price = courseUpdateDto.Price;
        course.ImagePath = courseUpdateDto.ImagePath;
        course.CategoryId = courseUpdateDto.CategoryId;
        course.UpdatedDate = DateTime.UtcNow;
        _unitOfWork.Courses.Update(course);
        var result = await _unitOfWork.SaveAsync();

        if (result > 0)
        {
            string cacheKey = $"course:{id}";
            await _cacheService.RemoveAsync(cacheKey);
            await _cacheService.RemoveAsync("courses:*");
            return ServiceResult.Ok(HttpStatusCode.NoContent, "Course updated successfully.");
        }

        return ServiceResult.Fail(HttpStatusCode.InternalServerError, "Failed to update course.");
    }


    public async Task<ServiceResult> DeleteCourseAsync(long id)
    {
        var course = await _unitOfWork.Courses.Include(c => c.Instructor).Include(c => c.Category)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (course is null)
        {
            return ServiceResult.Fail(HttpStatusCode.NotFound, $"Course with id {id} not found.");
        }

        var instructorId = _httpContextAccessor.HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (instructorId is null || course.InstructorId.ToString() != instructorId)
        {
            return ServiceResult.Fail(HttpStatusCode.Unauthorized, "Unauthorized user");
        }

        _unitOfWork.Courses.Remove(course);
        var result = await _unitOfWork.SaveAsync();

        if (result > 0)
        {
            string cacheKey = $"course:{id}";
            await _cacheService.RemoveAsync(cacheKey);
            await _cacheService.RemoveAsync("courses:*");
            return ServiceResult.Ok(message: "Course deleted successfully.");
        }

        return ServiceResult.Fail(HttpStatusCode.InternalServerError, "Failed to delete course.");
    }

    public async Task<ServiceResult<AllCourseDto>> SearchCourseAsync(SearchCourseDto searchCourseDto)
    {
        if (string.IsNullOrEmpty(searchCourseDto.SearchTerm))
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.BadRequest, "SearchTerm is required");
        }

        if (!Enum.TryParse<CourseSortBy>(searchCourseDto.SortOrder, true, out var sortByEnum))
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.BadRequest, "Invalid sorting parameter");
        }

        var lowerSearchTerm = searchCourseDto.SearchTerm.ToLower();
        var coursesQuery = _unitOfWork.Courses
            .Include(c => c.Category)
            .Include(c => c.Instructor)
            .AsNoTracking()
            .Where(c => EF.Functions.Like(c.Title.ToLower(), $"%{lowerSearchTerm}%"));

        var sortedQuery = sortByEnum switch
        {
            CourseSortBy.Alphabetical => coursesQuery.OrderBy(c => c.Title),
            CourseSortBy.PriceLowToHigh => coursesQuery.OrderBy(c => c.Price),
            CourseSortBy.PriceHighToLow => coursesQuery.OrderByDescending(c => c.Price),
            CourseSortBy.Newest => coursesQuery.OrderByDescending(c => c.CreatedDate),
            _ => coursesQuery.OrderBy(c => c.Title)
        };

        var courses = await sortedQuery
            .Skip((searchCourseDto.PageNumber - 1) * searchCourseDto.PageSize)
            .Take(searchCourseDto.PageSize)
            .ToListAsync();

        if (!courses.Any())
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.NotFound, "No courses found with the given title.");
        }

        var totalRecords = await coursesQuery.CountAsync();
        var totalPages = (int)Math.Ceiling(totalRecords / (double)searchCourseDto.PageSize);

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
            PageSize = searchCourseDto.PageSize,
            PageNumber = searchCourseDto.PageNumber,
            TotalPage = totalPages,
            TotalRecord = totalRecords,
            Courses = courseDtos
        };

        return ServiceResult<AllCourseDto>.Ok(result);
    }

    public async Task<ServiceResult<AllCourseDto>> GetInstructorCoursesAsync(int pageNumber, int pageSize)
    {
        var instructorId = _httpContextAccessor.HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (instructorId is null)
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.Unauthorized, "Unauthorized user");
        }

        var coursesQuery = _unitOfWork.Courses.Include(c => c.Instructor).Include(c => c.Category).AsNoTracking().Where(
            c => c.InstructorId == long.Parse(instructorId)
        );
        var courses = await coursesQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        if (!courses.Any())
        {
            return ServiceResult<AllCourseDto>.Fail(HttpStatusCode.NotFound, "No instructor's courses found.");
        }

        var totalRecords = await coursesQuery.CountAsync();
        var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

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
            PageSize = pageSize,
            PageNumber = pageNumber,
            TotalPage = totalPages,
            TotalRecord = totalRecords,
            Courses = courseDtos
        };
        return ServiceResult<AllCourseDto>.Ok(result);
    }
}