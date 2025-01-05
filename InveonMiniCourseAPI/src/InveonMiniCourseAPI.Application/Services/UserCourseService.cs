using System.Net;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Application.Services;

public class UserCourseService : IUserCourseService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UserCourseService> _logger;

    public UserCourseService(
        IUnitOfWork unitOfWork,
        ILogger<UserCourseService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<ServiceResult> EnrollUserToCoursesAsync(long orderId)
    {
        var order = await _unitOfWork.Orders
            .Include(o => o.OrderCourses)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            ServiceResult.Fail(HttpStatusCode.NotFound, $"Order with id {orderId} not found");

        foreach (var orderCourse in order.OrderCourses)
        {
            var userCourse = await _unitOfWork.UserCourses
                .FirstOrDefaultAsync(uc =>
                    uc.UserId == order.UserId &&
                    uc.CourseId == orderCourse.CourseId);

            if (userCourse == null)
            {
                await _unitOfWork.UserCourses.AddAsync(new UserCourse
                {
                    UserId = order.UserId,
                    CourseId = orderCourse.CourseId,
                    EnrollmentDate = DateTime.UtcNow
                });

                _logger.LogInformation(
                    "Enrolled user {UserId} to course {CourseId}",
                    order.UserId,
                    orderCourse.CourseId);
            }
        }

        var result = await _unitOfWork.SaveAsync();
        return result > 0 ? ServiceResult.Ok() : ServiceResult.Fail(HttpStatusCode.InternalServerError);
    }
}