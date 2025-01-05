using InveonMiniCourseAPI.Domain.Entities;
using InveonMiniCourseAPI.Persistence.DbContext;

namespace InveonMiniCourseAPI.Persistence.Seed;

public class CourseSeeder
{
    private readonly ApplicationDbContext _context;

    public CourseSeeder(ApplicationDbContext context)
    {
        _context = context;
    }

     public async Task SeedCoursesAsync()
    {
        if (_context.Courses.Any())
        {
            return;
        }
        var courses = new[]
        {
            new Course
            {
                Title = "Introduction to C#",
                Description = "Learn the basics of C# programming language.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 99.99m,
                CategoryId = 1,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Advanced Web Development",
                Description = "Deep dive into modern web development with ASP.NET Core and React.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 199.99m,
                CategoryId = 2,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Data Science with Python",
                Description = "Master data analysis and machine learning using Python and libraries like pandas and scikit-learn.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 149.99m,
                CategoryId = 3,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Digital Marketing Basics",
                Description = "Learn the fundamentals of digital marketing, including SEO, SEM, and social media strategies.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 79.99m,
                CategoryId = 4,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Introduction to Java",
                Description = "Get started with Java programming language and learn object-oriented principles.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 89.99m,
                CategoryId = 1,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Full Stack Web Development",
                Description = "Learn both front-end and back-end web development with modern technologies.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 299.99m,
                CategoryId = 2,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Machine Learning with R",
                Description = "Learn machine learning techniques and algorithms using R programming.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 179.99m,
                CategoryId = 3,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Front-End Development with React",
                Description = "Master React.js and build modern, responsive web applications.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 149.99m,
                CategoryId = 2,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Cloud Computing with AWS",
                Description = "Learn how to deploy, manage, and scale applications on Amazon Web Services (AWS).",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 249.99m,
                CategoryId = 5,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "UI/UX Design Principles",
                Description = "Learn the fundamentals of designing user interfaces and improving user experiences.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 129.99m,
                CategoryId = 6,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Data Analysis with Excel",
                Description = "Learn data manipulation, analysis, and visualization techniques using Excel.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 59.99m,
                CategoryId = 3,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Introduction to SQL Databases",
                Description = "Learn the basics of relational databases and SQL queries.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 79.99m,
                CategoryId = 3,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Blockchain for Beginners",
                Description = "Learn the fundamentals of blockchain technology and how it is transforming industries.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 199.99m,
                CategoryId = 7,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Cybersecurity Essentials",
                Description = "Understand the basics of cybersecurity and how to protect systems from potential threats.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 169.99m,
                CategoryId = 8,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Mobile App Development with Flutter",
                Description = "Learn how to build cross-platform mobile applications using Flutter.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 159.99m,
                CategoryId = 2,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            },
            new Course
            {
                Title = "Digital Photography for Beginners",
                Description = "Learn the basics of digital photography, including camera settings and composition.",
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Price = 99.99m,
                CategoryId = 9,
                ImagePath = "https://via.placeholder.com/150",
                InstructorId = 1,
            }
        };

        // Add courses to the database if they don't exist
        foreach (var course in courses)
        {
            if (!_context.Courses.Any(c => c.Title == course.Title))
            {
                await _context.Courses.AddAsync(course);
            }
        }

        await _context.SaveChangesAsync();
    }
   
}