namespace InveonMiniCourseAPI.Application.Interfaces;

public interface IUserCourseService
{
    Task<ServiceResult> EnrollUserToCoursesAsync(long orderId);
}