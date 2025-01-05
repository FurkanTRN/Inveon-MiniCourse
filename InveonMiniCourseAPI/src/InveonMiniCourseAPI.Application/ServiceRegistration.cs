using System.Security.Claims;
using System.Text;
using FluentValidation;
using InveonMiniCourseAPI.Application.DTOs;
using InveonMiniCourseAPI.Application.DTOs.CourseDtos;
using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Application.Services;
using InveonMiniCourseAPI.Application.Validator;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace InveonMiniCourseAPI.Application;

public static class ServiceRegistration
{
    public static void AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        AddValidations(services);
        AddJwtAuthentication(services, configuration);
        AddScopeServices(services);
        services.AddAuthorization();
    }

    private static void AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]);

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                        if (authHeader != null)
                        {
                            context.Token = authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                                ? authHeader.Substring(7)
                                : authHeader;
                        }

                        return Task.CompletedTask;
                    }
                };
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    RoleClaimType = "role",
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey =
                        new SymmetricSecurityKey(key),
                   
                };
            });
    }

    private static void AddScopeServices(IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IUserCourseService, UserCourseService>();
        services.AddScoped<IPaymentService, PaymentService>();

    }

    private static void AddValidations(IServiceCollection services)
    {
        services.AddTransient<IValidator<LoginDto>, LoginValidator>();
        services.AddTransient<IValidator<RegisterDto>, RegisterValidator>();
        services.AddTransient<IValidator<CourseCreateDto>, CourseCreateValidator>();
        services.AddTransient<IValidator<UserUpdateDto>, UserUpdateValidator>();
    }
}