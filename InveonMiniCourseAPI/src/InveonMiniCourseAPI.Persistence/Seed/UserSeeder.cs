using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Persistence.DbContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InveonMiniCourseAPI.Persistence.Seed;

public class UserSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<AppRole> _roleManager;

    public UserSeeder(ApplicationDbContext context, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedUsersAsync()
    {
        if (await _userManager.Users.AnyAsync())
        {
            return;
        }

        var users = new[]
        {
            new AppUser
            {
                Email = "instructor@email.com",
                FirstName = "Instructor",
                LastName = "TR",
                AvatarPath =
                    "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
            },
            new AppUser
            {
                Email = "user@email.com",
                FirstName = "User",
                LastName = "One",
                AvatarPath = "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
            },
            new AppUser
            {
                Email = "user2@email.com",
                FirstName = "User2",
                LastName = "Two",
                AvatarPath = "https://w7.pngwing.com/pngs/754/473/png-transparent-avatar-boy-man-avatar-vol-1-icon.png"
            }
        };
        await _userManager.CreateAsync(users[0],"Instructor.33");
        await _userManager.CreateAsync(users[1],"Student.33");
        await _userManager.CreateAsync(users[2],"Student.33");
        await _userManager.AddToRoleAsync(users[0], "Instructor");
        await _userManager.AddToRoleAsync(users[0], "Student");
        await _userManager.AddToRoleAsync(users[1], "Student");
        await _userManager.AddToRoleAsync(users[2], "Student");
    }
}