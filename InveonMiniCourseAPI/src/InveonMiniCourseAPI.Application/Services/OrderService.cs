using System.Net;
using System.Security.Claims;
using InveonMiniCourseAPI.Application.DTOs.OrderDtos;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Domain.Enums;
using InveonMiniCourseAPI.Domain.Event;
using InveonMiniCourseAPI.Domain.Interfaces;
using MassTransit;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.JsonWebTokens;

namespace InveonMiniCourseAPI.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMessageBus _messageBus;
    private readonly ILogger<OrderService> _logger;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IHttpContextAccessor _httpContextAccessor;


    public OrderService(
        IUnitOfWork unitOfWork,
        IMessageBus messageBus,
        ILogger<OrderService> logger, IPublishEndpoint publishEndpoint, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _messageBus = messageBus;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ServiceResult<OrderDto>> CreateOrderAsync(CreateOrderDto createOrderDto)
    {
        var order = new Order
        {
            UserId = createOrderDto.UserId,
            Status = OrderStatus.Pending,
            OrderDate = DateTime.UtcNow,
            TotalAmount = createOrderDto.Courses.Sum(c => c.Price)
        };

        foreach (var courseDto in createOrderDto.Courses)
        {
            var course = await _unitOfWork.Courses
                .FirstOrDefaultAsync(c => c.Id == courseDto.CourseId);

            if (course == null)
            {
                return ServiceResult<OrderDto>.Fail(HttpStatusCode.NotFound, "Course not found");
            }

            order.OrderCourses.Add(new OrderCourse
            {
                CourseId = courseDto.CourseId,
                PriceAtPurchase = courseDto.Price,
                PurchaseDate = DateTime.UtcNow
            });
        }

        await _unitOfWork.Orders.AddAsync(order);
        await _unitOfWork.SaveAsync();

        _logger.LogInformation("Created order with id {OrderId}", order.Id);
        await _publishEndpoint.Publish(new CancelOrderEvent
        {
            OrderId = order.Id
        }, x => x.Delay = TimeSpan.FromMinutes(5));
        var orderCreatedEvent = new OrderCreatedEvent
        {
            OrderId = order.Id,
            UserId = order.UserId,
            TotalAmount = order.TotalAmount,
            OrderDate = order.OrderDate,
            Status = order.Status,
            Courses = order.OrderCourses.Select(oc => new OrderCourseEventDto
            {
                CourseId = oc.CourseId,
                PriceAtPurchase = oc.PriceAtPurchase
            }).ToList()
        };

        await _messageBus.PublishAsync(orderCreatedEvent);
        var result = await GetOrderDtoAsync(order.Id);
        return ServiceResult<OrderDto>.Ok(result.Data);
    }

    public async Task<ServiceResult<OrderDto>> GetOrderAsync(long orderId)
    {
        var result = await GetOrderDtoAsync(orderId);
        if (result.Data is null)
        {
            return ServiceResult<OrderDto>.Fail(HttpStatusCode.NotFound, "Order not found");
        }

        return ServiceResult<OrderDto>.Ok(result.Data);
    }

    public async Task<ServiceResult<OrderDto>> UpdateOrderStatusAsync(long orderId, OrderStatus status)
    {
        var order = await _unitOfWork.Orders
            .Include(o => o.OrderCourses)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return ServiceResult<OrderDto>.Fail(HttpStatusCode.NotFound, $"Order with id {orderId} not found");
        order.Status = status;
        await _unitOfWork.SaveAsync();

        _logger.LogInformation("Updated order {OrderId} status to {Status}", orderId, status);
        var result = await GetOrderDtoAsync(orderId);
        return ServiceResult<OrderDto>.Ok(result.Data);
    }

    public async Task<ServiceResult<List<OrderDto>>> GetUserOrdersAsync()
    {
        var userClaimId = _httpContextAccessor.HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (userClaimId is null)
        {
            return ServiceResult<List<OrderDto>>.Fail(HttpStatusCode.Unauthorized, "User not authenticated");
        }

        var userId = long.Parse(userClaimId);
        var orders = await _unitOfWork.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderCourses)
            .ToListAsync();

        var courseIds = orders.SelectMany(o => o.OrderCourses.Select(oc => oc.CourseId)).Distinct().ToList();
        var courses = await _unitOfWork.Courses
            .Where(c => courseIds.Contains(c.Id))
            .ToListAsync();
        var orderDtos = orders.Select(order => new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            TotalAmount = order.TotalAmount,
            OrderDate = order.OrderDate,
            Status = order.Status.ToString(),
            Courses = order.OrderCourses.Select(oc => new OrderCourseDto
            {
                Id = oc.CourseId,
                Title = courses.First(c => c.Id == oc.CourseId).Title,
                PriceAtPurchase = oc.PriceAtPurchase,
                ImagePath = courses.First(c => c.Id == oc.CourseId).ImagePath
            }).ToList()
        }).ToList();

        return ServiceResult<List<OrderDto>>.Ok(orderDtos);
    }


    private async Task<ServiceResult<OrderDto>> GetOrderDtoAsync(long orderId)
    {
        var order = await _unitOfWork.Orders
            .Include(o => o.OrderCourses)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return ServiceResult<OrderDto>.Fail(HttpStatusCode.NotFound, $"Order with id {orderId} not found");

        var courseIds = order.OrderCourses.Select(oc => oc.CourseId).ToList();
        var courses = await _unitOfWork.Courses
            .Where(c => courseIds.Contains(c.Id))
            .ToListAsync();

        return ServiceResult<OrderDto>.Ok(new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            TotalAmount = order.TotalAmount,
            OrderDate = order.OrderDate,
            Status = order.Status.ToString(),
            Courses = order.OrderCourses.Select(oc => new OrderCourseDto
            {
                Id = oc.CourseId,
                Title = courses.First(c => c.Id == oc.CourseId).Title,
                PriceAtPurchase = oc.PriceAtPurchase,
                ImagePath = courses.First(c => c.Id == oc.CourseId).ImagePath
            }).ToList()
        });
    }
}