using InveonMiniCourseAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InveonMiniCourseAPI.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    DbSet<Course> Courses { get; }
    DbSet<Category> Categories { get; }
    DbSet<UserCourse> UserCourses { get; }
    DbSet<AppUser> Users { get; }
    
    DbSet<Order> Orders { get; }
    DbSet<Payment> Payments { get; }

    Task<int> SaveAsync();
}