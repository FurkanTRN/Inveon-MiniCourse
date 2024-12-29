namespace InveonMiniCourseAPI.Presentation.Extension;

public static class ServiceExtension
{
    public static void AddApiServices(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddControllers();
    }
    
    public static void AddSwaggerServices(this IServiceCollection services)
    {
        services.AddSwaggerGen();
    }
}