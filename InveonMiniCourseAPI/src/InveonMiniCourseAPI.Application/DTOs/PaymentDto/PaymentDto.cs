using InveonMiniCourseAPI.Domain.Enums;

namespace InveonMiniCourseAPI.Application.DTOs.PaymentDto;

public record PaymentDto
{
    public long OrderId { get; init; }
    public string TransactionId { get; init; }
    public decimal Amount { get; init; }
    public PaymentStatus Status { get; init; }
}