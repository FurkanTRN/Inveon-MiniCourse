using InveonMiniCourseAPI.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InveonMiniCourseAPI.Persistence.DbContext;

public class ApplicationDbContext : IdentityDbContext<AppUser, AppRole, long>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Course> Courses { get; set; } = null!;
    public DbSet<UserCourse> UserCourses { get; set; } = null!;
    public DbSet<OrderCourse> OrderCourses { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>()
            .HasMany(c => c.Courses)
            .WithOne(c => c.Category)
            .HasForeignKey(c => c.CategoryId);

        modelBuilder.Entity<UserCourse>()
            .HasKey(uc => new { uc.UserId, uc.CourseId });

        modelBuilder.Entity<Course>()
            .HasOne(c => c.Instructor)
            .WithMany(c => c.CreatedCourses)
            .HasForeignKey(c => c.InstructorId);

        modelBuilder.Entity<UserCourse>()
            .HasOne(uc => uc.User)
            .WithMany(u => u.EnrolledCourses)
            .HasForeignKey(uc => uc.UserId);

        modelBuilder.Entity<UserCourse>()
            .HasOne(uc => uc.Course)
            .WithMany(c => c.EnrolledUsers)
            .HasForeignKey(uc => uc.CourseId)
            .OnDelete(DeleteBehavior.NoAction);


        modelBuilder.Entity<OrderCourse>()
            .HasKey(oc => new { oc.OrderId, oc.CourseId });


        modelBuilder.Entity<OrderCourse>()
            .HasOne(oc => oc.Order)
            .WithMany(o => o.OrderCourses)
            .HasForeignKey(oc => oc.OrderId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<OrderCourse>()
            .HasOne(oc => oc.Course)
            .WithMany(c => c.OrderCourses)
            .HasForeignKey(oc => oc.CourseId);

        modelBuilder.Entity<Payment>()
            .HasIndex(p => p.TransactionId)
            .IsUnique();

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Order)
            .WithOne(o => o.Payment)
            .HasForeignKey<Payment>(p => p.OrderId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Payment>()
            .Property(p => p.PaymentMethod)
            .HasConversion<string>();

        modelBuilder.Entity<Payment>()
            .Property(p => p.PaymentStatus)
            .HasConversion<string>();
        base.OnModelCreating(modelBuilder);
    }
}