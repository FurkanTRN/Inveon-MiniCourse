using InveonMiniCourseAPI.Domain.Enums;

namespace InveonMiniCourseAPI.Application.DTOs.OrderDtos;

public record CreateOrderDto
{
    public long UserId { get; init; }
    public List<CreateOrderCourseDto> Courses { get; init; } = new();
}

public record CreateOrderCourseDto
{
    public long CourseId { get; init; }
    public decimal Price { get; init; }
}

public record OrderDto
{
    public long Id { get; init; }
    public long UserId { get; init; }
    public decimal TotalAmount { get; init; }
    public DateTime OrderDate { get; init; }
    public string Status { get; init; }
    public List<OrderCourseDto> Courses { get; init; } = new();
}

public record OrderCourseDto
{
    public long Id { get; init; }
    public string Title { get; init; }
    public decimal PriceAtPurchase { get; init; }
    
    public string? ImagePath { get; init; }
}