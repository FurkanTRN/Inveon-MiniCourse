using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using InveonMiniCourseAPI.Application.DTOs.CategoryDtos;
using Microsoft.AspNetCore.Mvc;

namespace InveonMiniCourseAPI.Application;

public class ServiceResult
{
    [JsonIgnore]
    public bool Success { get; set; }

    public string Message { get; set; }
    public HttpStatusCode StatusCode { get; set; }
    public ProblemDetails ProblemDetails { get; set; }

    public static ServiceResult Ok(HttpStatusCode statusCode=HttpStatusCode.OK,string message = null)
    {
        return new ServiceResult
        {
            Success = true,
            Message = message,
            StatusCode = statusCode
        };
    }

    public static ServiceResult Fail(HttpStatusCode statusCode, string message = null,
        ProblemDetails problemDetails = null)
    {
        return new ServiceResult
        {
            Success = false,
            Message = message,
            StatusCode = statusCode,
            ProblemDetails = problemDetails
        };
    }
}

public class ServiceResult<T> : ServiceResult
{
    public T Data { get; set; }

    public static ServiceResult<T> Ok(T data, string message = null)
    {
        return new ServiceResult<T>
        {
            Success = true,
            Data = data,
            Message = message,
            StatusCode = HttpStatusCode.OK
        };
    }

    public static ServiceResult<T> Fail(HttpStatusCode statusCode, string message = null,
        ProblemDetails problemDetails = null)
    {
        return new ServiceResult<T>
        {
            Success = false,
            Message = message,
            StatusCode = statusCode,
            ProblemDetails = problemDetails
        };
    }
}