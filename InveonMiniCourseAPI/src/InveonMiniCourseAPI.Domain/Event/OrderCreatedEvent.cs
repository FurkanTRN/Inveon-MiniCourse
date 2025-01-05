using InveonMiniCourseAPI.Domain.Enums;

namespace InveonMiniCourseAPI.Domain.Event;

public record OrderCreatedEvent
{
    public long OrderId { get; init; }
    public long UserId { get; init; }
    public decimal TotalAmount { get; init; }
    public DateTime OrderDate { get; init; }
    public OrderStatus Status { get; init; }
    public IReadOnlyCollection<OrderCourseEventDto> Courses { get; init; }
}

public record PaymentCompletedEvent
{
    public long OrderId { get; init; }
    public string TransactionId { get; init; }
    public decimal Amount { get; init; }
    public DateTime PaymentDate { get; init; }
    public PaymentStatus Status { get; init; }
}

public record OrderCourseEventDto
{
    public long CourseId { get; init; }
    public decimal PriceAtPurchase { get; init; }
}