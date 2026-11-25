using InternUp.Domain.Entities;
using InternUp.Domain.Search;

namespace InternUp.Application.Ports.Outbound;

public interface IVerificationRepository
{
    Task<IReadOnlyList<StudentVerification>> SearchAsync(VerificationSearchCriteria criteria, CancellationToken cancellationToken);
    Task<int> CountAsync(VerificationSearchCriteria criteria, CancellationToken cancellationToken);
    Task<StudentVerification?> FindAsync(string id, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(string id, CancellationToken cancellationToken);
    Task<StudentVerification?> FindLatestForStudentAsync(string studentEmail, CancellationToken cancellationToken);
    Task<IReadOnlyList<StudentVerification>> FindVerifiedByStudentNumberAsync(
        string universityId,
        string studentNumber,
        CancellationToken cancellationToken);
    void Add(StudentVerification verification);
}
