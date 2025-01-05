namespace InveonMiniCourseAPI.Domain.Event;

public record CancelOrderEvent
{
    public long OrderId { get; init; }
}
