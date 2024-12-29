namespace InveonMiniCourseAPI.Domain.Entities;

public class Order
{
    public long Id { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public long UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public decimal TotalAmount { get; set; }

    public Payment Payment { get; set; } = null!;
    public ICollection<OrderCourse> OrderCourses { get; set; } = new HashSet<OrderCourse>();
}