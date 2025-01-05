using InveonMiniCourseAPI.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace InveonMiniCourseAPI.Persistence.Seed;

public class RoleSeeder
{
    public static async Task SeedRolesAsync(RoleManager<AppRole> roleManager)
    {
        var roles = new[] { "Student", "Instructor" };

        foreach (var role in roles)
        {
            var roleExist = await roleManager.RoleExistsAsync(role);
            if (!roleExist)
            {
                var appRole = new AppRole
                {
                    Name = role,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await roleManager.CreateAsync(appRole);
            }
        }
    }
}