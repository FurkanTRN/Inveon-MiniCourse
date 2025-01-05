using InveonMiniCourseAPI.Application.DTOs.PaymentDto;
using InveonMiniCourseAPI.Domain.Enums;
using InveonMiniCourseAPI.Domain.Event;
using InveonMiniCourseAPI.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Presentation.Controllers;

[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly IMessageBus _messageBus;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(
        IMessageBus messageBus,
        ILogger<PaymentController> logger)
    {
        _messageBus = messageBus;
        _logger = logger;
    }

    [HttpPost("complete")]
    public async Task<IActionResult> HandlePaymentComplete([FromBody] PaymentDto paymentInfo)
    {
        _logger.LogInformation(
            "HandlePaymentComplete endpoint called for Order {OrderId}, Transaction {TransactionId}",
            paymentInfo.OrderId,
            paymentInfo.TransactionId);

        try
        {
            var paymentEvent = new PaymentCompletedEvent
            {
                OrderId = paymentInfo.OrderId,
                TransactionId = paymentInfo.TransactionId,
                Amount = paymentInfo.Amount,
                PaymentDate = DateTime.UtcNow,
                Status = paymentInfo.Status
            };

            await _messageBus.PublishAsync(paymentEvent);

            _logger.LogInformation(
                "Published PaymentCompletedEvent for Order {OrderId}, Transaction {TransactionId}",
                paymentInfo.OrderId,
                paymentInfo.TransactionId);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error processing payment webhook for Order {OrderId}, Transaction {TransactionId}",
                paymentInfo.OrderId,
                paymentInfo.TransactionId);
            return StatusCode(500, "An error occurred while processing the payment webhook");
        }
    }
}