using InternUp.Domain.Enums;

namespace InternUp.Domain.Search;

public sealed record VerificationSearchCriteria
{
    private VerificationSearchCriteria(string universityId, string studentEmail, VerificationStatus? status, int page, int pageSize)
    {
        UniversityId = universityId;
        StudentEmail = studentEmail;
        Status = status;
        Page = page;
        PageSize = pageSize;
    }

    public string UniversityId { get; }
    public string StudentEmail { get; }
    public VerificationStatus? Status { get; }
    public int Page { get; }
    public int PageSize { get; }

    public static VerificationSearchCriteria Create(string? universityId, string? studentEmail, string? status, int? page, int? pageSize)
    {
        VerificationStatus? verificationStatus = null;
        if (!string.IsNullOrWhiteSpace(status))
        {
            verificationStatus = VerificationStatusExtensions.Parse(status);
        }

        var currentPage = page ?? 1;
        if (currentPage < 1)
        {
            currentPage = 1;
        }

        var size = pageSize ?? 20;
        if (size < 1)
        {
            size = 1;
        }
        if (size > 100)
        {
            size = 100;
        }

        return new VerificationSearchCriteria(
            universityId?.Trim() ?? "",
            studentEmail?.Trim().ToLower() ?? "",
            verificationStatus,
            currentPage,
            size);
    }
}
