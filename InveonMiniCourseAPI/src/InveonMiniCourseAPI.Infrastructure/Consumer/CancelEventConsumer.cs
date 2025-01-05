using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Enums;
using InveonMiniCourseAPI.Domain.Event;
using Microsoft.EntityFrameworkCore;

namespace InveonMiniCourseAPI.Infrastructure;

using MassTransit;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

public class CancelOrderEventConsumer : IConsumer<CancelOrderEvent>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CancelOrderEventConsumer> _logger;

    public CancelOrderEventConsumer(
        IUnitOfWork unitOfWork,
        ILogger<CancelOrderEventConsumer> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<CancelOrderEvent> context)
    {
        var orderId = context.Message.OrderId;
        var order = await _unitOfWork.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId && o.Status == OrderStatus.Pending);

        if (order == null)
        {
            _logger.LogWarning("Order {OrderId} not found or already processed.", orderId);
            return;
        }

        order.Status = OrderStatus.Cancelled;
        await _unitOfWork.SaveAsync();

        _logger.LogInformation("Order {OrderId} has been automatically cancelled after timeout.", orderId);
    }
}