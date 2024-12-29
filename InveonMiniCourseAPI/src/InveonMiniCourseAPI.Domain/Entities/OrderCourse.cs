namespace InveonMiniCourseAPI.Domain.Entities;

public class OrderCourse
{
    public long OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public long CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public decimal PriceAtPurchase { get; set; }
    public DateTime PurchaseDate { get; set; }=DateTime.UtcNow;
}