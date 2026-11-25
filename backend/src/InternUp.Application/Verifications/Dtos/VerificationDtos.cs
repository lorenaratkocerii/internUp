namespace InternUp.Application.Verifications.Dtos;

public sealed record VerificationStudentDto(string Email, string? Name);

public sealed record VerificationDto(
    string Id,
    string UniversityId,
    VerificationStudentDto Student,
    string StudentNumber,
    string UniversityEmail,
    string Faculty,
    string Program,
    string StudyYear,
    string Status,
    DateTimeOffset SubmittedAt,
    DateTimeOffset? DecidedAt,
    string DecidedBy,
    string Note);

public sealed record VerificationListDto(IReadOnlyList<VerificationDto> Items, int TotalCount, int Page, int PageSize, int TotalPages);

public sealed record SubmitVerificationRequest(
    string? Id,
    string UniversityId,
    VerificationStudentDto Student,
    string StudentNumber,
    string UniversityEmail,
    string Faculty,
    string Program,
    string StudyYear);

public sealed record DecideVerificationRequest(string Status, string? Note, string? DecidedBy);
