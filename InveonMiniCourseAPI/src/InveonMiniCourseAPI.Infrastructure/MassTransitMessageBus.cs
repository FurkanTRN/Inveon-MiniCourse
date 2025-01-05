using InveonMiniCourseAPI.Domain.Interfaces;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace InveonMiniCourseAPI.Infrastructure;

public class MassTransitMessageBus : IMessageBus
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<MassTransitMessageBus> _logger;

    public MassTransitMessageBus(
        IPublishEndpoint publishEndpoint,
        ILogger<MassTransitMessageBus> logger)
    {
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    public async Task PublishAsync<T>(T message, CancellationToken cancellationToken = default) where T : class
    {
        try
        {
            await _publishEndpoint.Publish(message, cancellationToken);
            _logger.LogInformation("Message of type {MessageType} published successfully", typeof(T).Name);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish message of type {MessageType}", typeof(T).Name);
            throw;
        }
    }
}