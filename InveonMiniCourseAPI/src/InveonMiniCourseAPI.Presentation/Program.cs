using InveonMiniCourseAPI.Application;
using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Infrastructure;
using InveonMiniCourseAPI.Persistence;
using InveonMiniCourseAPI.Persistence.DbContext;
using InveonMiniCourseAPI.Persistence.Seed;
using InveonMiniCourseAPI.Presentation.Extension;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiServices();
builder.Services.AddSwaggerServices();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddPersistenceServices(builder.Configuration);
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate();
    context.Database.EnsureCreated();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AppRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    var seeder = new CategorySeeder(context);
    var seeder2 = new UserSeeder(context, userManager, roleManager);
    var seeder3 = new CourseSeeder(context);
    await RoleSeeder.SeedRolesAsync(roleManager);
    await seeder2.SeedUsersAsync();
    await seeder.SeedCategoriesAsync();
    await seeder3.SeedCoursesAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseExceptionHandler();
app.MapControllers();
app.Run();