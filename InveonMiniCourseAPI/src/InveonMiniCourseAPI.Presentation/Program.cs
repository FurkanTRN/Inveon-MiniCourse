using InveonMiniCourseAPI.Application;
using InveonMiniCourseAPI.Infrastructure;
using InveonMiniCourseAPI.Persistence;
using InveonMiniCourseAPI.Presentation.Extension;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiServices();
builder.Services.AddSwaggerServices();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddPersistenceServices(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.Run();