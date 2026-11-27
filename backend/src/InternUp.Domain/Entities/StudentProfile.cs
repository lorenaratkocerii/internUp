namespace InternUp.Domain.Entities;

public sealed class StudentProfile
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string University { get; set; } = string.Empty;
    public string Faculty { get; set; } = string.Empty;
    public string StudyProgram { get; set; } = string.Empty;
    public string StudyYear { get; set; } = string.Empty;
    public string GraduationYear { get; set; } = string.Empty;
    public string Gpa { get; set; } = string.Empty;
    public string Github { get; set; } = string.Empty;
    public string Portfolio { get; set; } = string.Empty;
    public string Cv { get; set; } = string.Empty;
    public string Transcript { get; set; } = string.Empty;
    public string DetailsJson { get; set; } = "{}";
}
