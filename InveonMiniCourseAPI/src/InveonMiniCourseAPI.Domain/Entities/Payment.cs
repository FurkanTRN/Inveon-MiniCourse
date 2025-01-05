using InveonMiniCourseAPI.Domain.Enums;

namespace InveonMiniCourseAPI.Domain.Entities;

public class Payment
{
    public long Id { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    public string TransactionId { get; set; } = Guid.NewGuid().ToString();

    public long OrderId { get; set; }
    public Order Order { get; set; } = null!;
}