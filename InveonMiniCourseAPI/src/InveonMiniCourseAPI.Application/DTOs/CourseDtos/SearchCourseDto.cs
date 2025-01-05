namespace InveonMiniCourseAPI.Application.DTOs.CourseDtos;

public class SearchCourseDto
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public string SortOrder { get; set; } = "Newest";
}