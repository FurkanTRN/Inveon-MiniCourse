using InveonMiniCourseAPI.Application.Services;
using InveonMiniCourseAPI.Domain.Event;
using InveonMiniCourseAPI.Domain.Interfaces;
using InveonMiniCourseAPI.Infrastructure.Services;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace InveonMiniCourseAPI.Infrastructure;

public static class ServiceRegistration
{
    public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddMassTransit(x =>
        {
            x.AddConsumer<OrderCreatedEventConsumer>();
            x.AddConsumer<PaymentCompletedEventConsumer>();
            x.AddConsumer<CancelOrderEventConsumer>();
            x.AddDelayedMessageScheduler();


            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Host(configuration["RabbitMQ:Host"], "/", h =>
                {
                    h.Username(configuration["RabbitMQ:Username"]);
                    h.Password(configuration["RabbitMQ:Password"]);
                });

                cfg.UseDelayedMessageScheduler();
                cfg.ReceiveEndpoint("cancel-order-queue",
                    e => { e.ConfigureConsumer<CancelOrderEventConsumer>(context); });
                cfg.ConfigureEndpoints(context);
                cfg.UseMessageRetry(r => { r.Incremental(3, TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(2)); });

                cfg.Message<OrderCreatedEvent>(e => { e.SetEntityName("order-created"); });

                cfg.Message<PaymentCompletedEvent>(e => { e.SetEntityName("payment-completed"); });
            });
        });
        services.AddScoped<IMessageBus, MassTransitMessageBus>();
        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var config = configuration.GetSection("Redis:ConnectionString").Value;
            return ConnectionMultiplexer.Connect(config);
        });
        services.AddSingleton<ICacheService, CacheService>();
    }
}