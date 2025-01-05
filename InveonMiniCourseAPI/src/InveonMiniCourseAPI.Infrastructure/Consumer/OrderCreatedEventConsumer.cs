using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Event;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Infrastructure;

public class OrderCreatedEventConsumer : IConsumer<OrderCreatedEvent>
{
    private readonly ILogger<OrderCreatedEventConsumer> _logger;
    private readonly IUserCourseService _userCourseService;

    public OrderCreatedEventConsumer(
        ILogger<OrderCreatedEventConsumer> logger,
        IUserCourseService userCourseService)
    {
        _logger = logger;
        _userCourseService = userCourseService;
    }

    public async Task Consume(ConsumeContext<OrderCreatedEvent> context)
    {
        try
        {
            _logger.LogInformation("Processing OrderCreatedEvent for Order {OrderId}", context.Message.OrderId);
            
           
            await _userCourseService.EnrollUserToCoursesAsync(context.Message.OrderId);
            
            _logger.LogInformation("Successfully processed OrderCreatedEvent for Order {OrderId}", context.Message.OrderId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing OrderCreatedEvent for Order {OrderId}", context.Message.OrderId);
            throw;
        }
    }
}
