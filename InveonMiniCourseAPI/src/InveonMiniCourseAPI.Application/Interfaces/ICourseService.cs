using InveonMiniCourseAPI.Application.DTOs.CourseDtos;
using InveonMiniCourseAPI.Domain.Enums;

namespace InveonMiniCourseAPI.Application.Interfaces;

public interface ICourseService
{
    Task<ServiceResult> CreateCourseAsync(CourseCreateDto courseCreateDto);
    Task<ServiceResult<CourseDto>> GetCourseByIdAsync(long id);
    Task<ServiceResult<AllCourseDto>> GetAllCoursesAsync(int pageNumber, int pageSize, string sortBy);
    Task<ServiceResult> UpdateCourseAsync(long id, CourseUpdateDto courseUpdateDto);
    Task<ServiceResult> DeleteCourseAsync(long id);
    Task<ServiceResult<AllCourseDto>> SearchCourseAsync(SearchCourseDto searchCourseDto);
    Task<ServiceResult<AllCourseDto>> GetInstructorCoursesAsync(int pageNumber, int pageSize);
}