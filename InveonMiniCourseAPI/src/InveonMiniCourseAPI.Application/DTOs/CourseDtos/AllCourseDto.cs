namespace InveonMiniCourseAPI.Application.DTOs.CourseDtos;

public class AllCourseDto
{
    public int PageSize { get; set; }
    public int PageNumber { get; set; }
    public int TotalPage { get; set; }
    public int TotalRecord { get; set; }
    public List<CourseDto> Courses { get; set; }
}