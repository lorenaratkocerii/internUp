using System.Text.RegularExpressions;
using InternUp.Domain.Enums;
using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Entities;

public sealed class StudentVerification
{
    public static readonly string[] StudyYears = ["Viti i parë", "Viti i dytë", "Viti i tretë", "Viti i katërt", "Master"];

    private StudentVerification() { }

    public string Id { get; private set; } = null!;
    public string UniversityId { get; private set; } = null!;
    public string StudentEmail { get; private set; } = null!;
    public string StudentName { get; private set; } = string.Empty;
    public string StudentNumber { get; private set; } = null!;
    public string UniversityEmail { get; private set; } = null!;
    public string Faculty { get; private set; } = null!;
    public string Program { get; private set; } = null!;
    public string StudyYear { get; private set; } = null!;
    public VerificationStatus Status { get; private set; }
    public DateTimeOffset SubmittedAt { get; private set; }
    public DateTimeOffset? DecidedAt { get; private set; }
    public string DecidedBy { get; private set; } = string.Empty;
    public string Note { get; private set; } = string.Empty;

    public static StudentVerification Create(
        string id,
        string universityId,
        string studentEmail,
        string? studentName,
        string studentNumber,
        string universityEmail,
        string faculty,
        string program,
        string studyYear,
        DateTimeOffset submittedAt)
    {
        if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(studentEmail))
        {
            throw new DomainException("Kërkesa duhet të ketë id, universitet dhe student.");
        }
        if (id.Trim().Length > 100)
        {
            throw new DomainException("ID e kërkesës është shumë e gjatë.");
        }
        if (string.IsNullOrWhiteSpace(universityId))
        {
            throw new DomainException("Zgjidh universitetin.");
        }

        studentNumber = studentNumber?.Trim() ?? "";
        universityEmail = universityEmail?.Trim().ToLower() ?? "";
        faculty = faculty?.Trim() ?? "";
        program = program?.Trim() ?? "";
        studyYear = studyYear?.Trim() ?? "";

        if (!Regex.IsMatch(studentNumber, "^[A-Za-z0-9/-]{4,20}$"))
        {
            throw new DomainException("Numri i indeksit duhet të ketë 4–20 karaktere (shifra, shkronja, / ose -).");
        }
        if (universityEmail.Length > 150 || !Regex.IsMatch(universityEmail, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
        {
            throw new DomainException("Shkruaj email-in universitar.");
        }
        if (faculty.Length == 0 || faculty.Length > 150)
        {
            throw new DomainException("Shkruaj fakultetin.");
        }
        if (program.Length == 0 || program.Length > 150)
        {
            throw new DomainException("Shkruaj drejtimin e studimeve.");
        }
        if (!StudyYears.Contains(studyYear))
        {
            throw new DomainException("Zgjidh vitin e studimeve.");
        }

        studentEmail = studentEmail.Trim().ToLower();
        studentName = studentName?.Trim() ?? "";
        if (studentEmail.Length > 150 || studentName.Length > 150)
        {
            throw new DomainException("Emri ose email-i i studentit është shumë i gjatë.");
        }
        if (!Regex.IsMatch(studentEmail, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
        {
            throw new DomainException("Email-i i studentit nuk është i saktë.");
        }

        return new StudentVerification
        {
            Id = id.Trim(),
            UniversityId = universityId.Trim(),
            StudentEmail = studentEmail,
            StudentName = studentName.Length > 0 ? studentName : studentEmail,
            StudentNumber = studentNumber,
            UniversityEmail = universityEmail,
            Faculty = faculty,
            Program = program,
            StudyYear = studyYear,
            Status = VerificationStatus.Pending,
            SubmittedAt = submittedAt,
        };
    }

    public bool CanMoveTo(VerificationStatus status) => Status switch
    {
        VerificationStatus.Pending => status is VerificationStatus.Verified or VerificationStatus.Rejected,
        VerificationStatus.Verified => status == VerificationStatus.Rejected,
        VerificationStatus.Rejected => status == VerificationStatus.Verified,
        _ => false,
    };

    public void Decide(VerificationStatus status, string? note, string? decidedBy, DateTimeOffset at)
    {
        if (!CanMoveTo(status))
        {
            throw new DomainException($"Kërkesa që është \"{Status.ToLabel()}\" nuk mund të kalojë në \"{status.ToLabel()}\".");
        }

        note = note?.Trim() ?? "";
        if (status == VerificationStatus.Rejected && note.Length == 0)
        {
            throw new DomainException("Shkruaj arsyen që studenti ta dijë çfarë duhet të rregullojë.");
        }
        if (note.Length > 500)
        {
            throw new DomainException("Arsyeja nuk mund të ketë më shumë se 500 karaktere.");
        }

        Status = status;
        Note = note;
        DecidedBy = decidedBy?.Trim() ?? "";
        DecidedAt = at;
    }
}
