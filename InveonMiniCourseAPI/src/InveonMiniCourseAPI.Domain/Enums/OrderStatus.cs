namespace InveonMiniCourseAPI.Domain.Enums;

public enum OrderStatus
{
    Pending = 0,
    PaymentProcessing = 1,
    PaymentFailed = 2,
    Completed = 3,
    Cancelled = 4
}