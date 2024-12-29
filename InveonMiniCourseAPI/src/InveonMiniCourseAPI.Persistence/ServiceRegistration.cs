using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace InveonMiniCourseAPI.Persistence;

public static class ServiceRegistration
{
    public static void AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("SqlServer")));
        services.AddIdentity<AppUser, AppRole>().AddEntityFrameworkStores<ApplicationDbContext>();
    }
}