using InveonMiniCourseAPI.Application.Interfaces;
using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace InveonMiniCourseAPI.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public DbSet<Course> Courses => _context.Courses;
    public DbSet<Category> Categories => _context.Categories;
    public DbSet<UserCourse> UserCourses => _context.UserCourses;
    public DbSet<AppUser> Users => _context.Users;
    public DbSet<Order> Orders => _context.Orders;

    public DbSet<Payment> Payments => _context.Payments;
    public async Task<int> SaveAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}