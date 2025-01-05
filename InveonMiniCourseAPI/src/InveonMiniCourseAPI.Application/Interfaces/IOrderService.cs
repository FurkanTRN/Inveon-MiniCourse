using InveonMiniCourseAPI.Application.DTOs.OrderDtos;
using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Domain.Enums;

namespace InveonMiniCourseAPI.Application.Interfaces;

public interface IOrderService
{
    Task<ServiceResult<OrderDto>> CreateOrderAsync(CreateOrderDto createOrderDto);
    Task<ServiceResult<OrderDto>> GetOrderAsync(long orderId);
    Task<ServiceResult<OrderDto>> UpdateOrderStatusAsync(long orderId, OrderStatus status);
    Task<ServiceResult<List<OrderDto>>> GetUserOrdersAsync();
}