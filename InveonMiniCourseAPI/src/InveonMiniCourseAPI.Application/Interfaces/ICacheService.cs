using Microsoft.Extensions.Caching.Distributed;

namespace InveonMiniCourseAPI.Application.Services;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key);
    Task SetAsync<T>(string key, T value, TimeSpan expiration);
    Task<bool> RemoveAsync(string key);
}