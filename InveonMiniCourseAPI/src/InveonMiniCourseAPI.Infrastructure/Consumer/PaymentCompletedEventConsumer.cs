using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Enums;
using InveonMiniCourseAPI.Domain.Event;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Infrastructure;

public class PaymentCompletedEventConsumer : IConsumer<PaymentCompletedEvent>
{
    private readonly ILogger<PaymentCompletedEventConsumer> _logger;
    private readonly IOrderService _orderService;
    private readonly IUserCourseService _userCourseService;
    private readonly IPaymentService _paymentService;

    public PaymentCompletedEventConsumer(
        ILogger<PaymentCompletedEventConsumer> logger,
        IOrderService orderService,
        IUserCourseService userCourseService,
        IPaymentService paymentService)
    {
        _logger = logger;
        _orderService = orderService;
        _userCourseService = userCourseService;
        _paymentService = paymentService;
    }

    public async Task Consume(ConsumeContext<PaymentCompletedEvent> context)
    {
        try
        {
            var message = context.Message;
            _logger.LogInformation("Processing PaymentCompletedEvent for Order {OrderId}", message.OrderId);

            var payment = await _paymentService.CreatePaymentAsync(message);

            if (message.Status == PaymentStatus.Completed)
            {
                await _orderService.UpdateOrderStatusAsync(message.OrderId, OrderStatus.PaymentFailed);
                await _userCourseService.EnrollUserToCoursesAsync(message.OrderId);
            }
            else
            {
                await _orderService.UpdateOrderStatusAsync(message.OrderId, OrderStatus.PaymentFailed);
            }

            _logger.LogInformation(
                "Successfully processed PaymentCompletedEvent for Order {OrderId} with PaymentId {PaymentId}",
                message.OrderId, payment.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing PaymentCompletedEvent for Order {OrderId}", context.Message.OrderId);
            throw;
        }
    }
}