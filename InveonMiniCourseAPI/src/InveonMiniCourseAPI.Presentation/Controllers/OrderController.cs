using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InveonMiniCourseAPI.Application.DTOs.OrderDtos;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Presentation.Controllers;

[ApiController]
[Route("api/order")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        IOrderService orderService,
        ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto createOrderDto)
    {
        _logger.LogInformation("CreateOrder endpoint called for user.");

        var result = await _orderService.CreateOrderAsync(createOrderDto);

        if (!result.Success)
        {
            _logger.LogError("Failed to create order. Status: {StatusCode}, Message: {Message}",
                result.StatusCode, result.Message);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Order created successfully. Order ID: {OrderId}", result.Data.Id);
        return CreatedAtAction(
            nameof(GetOrder),
            new { orderId = result.Data.Id },
            result.Data);
    }

    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetOrder(long orderId)
    {
        _logger.LogInformation("GetOrder endpoint called for order ID: {OrderId}", orderId);

        var result = await _orderService.GetOrderAsync(orderId);

        if (!result.Success)
        {
            _logger.LogError("Failed to retrieve order for ID: {OrderId}. Status: {StatusCode}, Message: {Message}",
                orderId, result.StatusCode, result.Message);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Retrieved order successfully for ID: {OrderId}", orderId);
        return Ok(result.Data);
    }

    [HttpGet("user")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetUserOrders()
    {
        _logger.LogInformation("GetUserOrders endpoint called for authenticated user.");

        var result = await _orderService.GetUserOrdersAsync();

        if (!result.Success)
        {
            _logger.LogError("Failed to retrieve user orders. Status: {StatusCode}, Message: {Message}",
                result.StatusCode, result.Message);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Retrieved user orders successfully. Count: {OrderCount}", result.Data?.Count);
        return Ok(result.Data);
    }

    [HttpPut("{orderId}/status")]
    public async Task<IActionResult> UpdateOrderStatus(long orderId, [FromBody] OrderStatus status)
    {
        _logger.LogInformation("UpdateOrderStatus endpoint called for order ID: {OrderId}, Status: {Status}",
            orderId, status);

        var result = await _orderService.UpdateOrderStatusAsync(orderId, status);

        if (!result.Success)
        {
            _logger.LogError("Failed to update order status for ID: {OrderId}. Status: {StatusCode}, Message: {Message}",
                orderId, result.StatusCode, result.Message);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Order status updated successfully for ID: {OrderId}", orderId);
        return Ok(result.Data);
    }
}