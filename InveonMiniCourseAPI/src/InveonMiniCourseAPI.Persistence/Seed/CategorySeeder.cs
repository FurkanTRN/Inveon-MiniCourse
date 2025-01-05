using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace InveonMiniCourseAPI.Persistence.Seed;

public class CategorySeeder
{
    private readonly ApplicationDbContext _context;

    public CategorySeeder(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SeedCategoriesAsync()
    {
        if (await _context.Categories.AnyAsync())
        {
            return; 
        }

        var categories = new[]
        {
            new Category { Name = "Software Development", CreatedDate = DateTime.UtcNow },
            new Category { Name = "Data Science", CreatedDate = DateTime.UtcNow },
            new Category { Name = "Machine Learning", CreatedDate = DateTime.UtcNow },
            new Category { Name = "Artificial Intelligence", CreatedDate = DateTime.UtcNow },
            new Category { Name = "Cyber Security", CreatedDate = DateTime.UtcNow },
            new Category { Name = "Web Development", CreatedDate = DateTime.UtcNow },
            new Category { Name = "Mobile Development", CreatedDate = DateTime.UtcNow },
            new Category { Name = "Game Development", CreatedDate = DateTime.UtcNow },
            new Category { Name = "DevOps", CreatedDate = DateTime.UtcNow },
            new Category { Name = "Cloud Computing", CreatedDate = DateTime.UtcNow }
        };

        await _context.Categories.AddRangeAsync(categories);
        await _context.SaveChangesAsync();
    }
}