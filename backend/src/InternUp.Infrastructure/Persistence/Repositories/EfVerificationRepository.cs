using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using InternUp.Domain.Search;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence.Repositories;

internal sealed class EfVerificationRepository(InternUpDbContext context) : IVerificationRepository
{
    private IQueryable<StudentVerification> Filter(VerificationSearchCriteria criteria)
    {
        var query = context.Set<StudentVerification>().AsNoTracking();

        if (criteria.UniversityId.Length > 0)
        {
            query = query.Where(verification => verification.UniversityId == criteria.UniversityId);
        }
        if (criteria.StudentEmail.Length > 0)
        {
            query = query.Where(verification => verification.StudentEmail == criteria.StudentEmail);
        }
        if (criteria.Status != null)
        {
            query = query.Where(verification => verification.Status == criteria.Status);
        }
        return query;
    }

    public async Task<IReadOnlyList<StudentVerification>> SearchAsync(VerificationSearchCriteria criteria, CancellationToken cancellationToken) =>
        await Filter(criteria)
            .OrderByDescending(verification => verification.SubmittedAt)
            .ThenBy(verification => verification.Id)
            .Skip((criteria.Page - 1) * criteria.PageSize)
            .Take(criteria.PageSize)
            .ToListAsync(cancellationToken);

    public Task<int> CountAsync(VerificationSearchCriteria criteria, CancellationToken cancellationToken) =>
        Filter(criteria).CountAsync(cancellationToken);

    public Task<StudentVerification?> FindAsync(string id, CancellationToken cancellationToken) =>
        context.Set<StudentVerification>().FirstOrDefaultAsync(verification => verification.Id == id, cancellationToken);

    public Task<bool> ExistsAsync(string id, CancellationToken cancellationToken) =>
        context.Set<StudentVerification>().AnyAsync(verification => verification.Id == id, cancellationToken);

    public Task<StudentVerification?> FindLatestForStudentAsync(string studentEmail, CancellationToken cancellationToken)
    {
        var email = studentEmail.Trim().ToLower();
        return context.Set<StudentVerification>()
            .Where(verification => verification.StudentEmail == email)
            .OrderByDescending(verification => verification.SubmittedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<StudentVerification>> FindVerifiedByStudentNumberAsync(
        string universityId,
        string studentNumber,
        CancellationToken cancellationToken) =>
        await context.Set<StudentVerification>()
            .Where(verification =>
                verification.UniversityId == universityId &&
                verification.StudentNumber == studentNumber &&
                verification.Status == VerificationStatus.Verified)
            .ToListAsync(cancellationToken);

    public void Add(StudentVerification verification) => context.Set<StudentVerification>().Add(verification);
}
