using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence.Repositories;

internal sealed class EfInternshipRepository(InternUpDbContext context) : IInternshipRepository
{
    private IQueryable<Internship> Query() =>
        context.Internships
            .AsNoTracking()
            .Include(internship => internship.Company)
            .Include(internship => internship.Skills.OrderBy(skill => skill.Id))
            .AsSplitQuery()
            .OrderBy(internship => internship.DisplayOrder);

    public async Task<IReadOnlyList<Internship>> GetAllAsync(CancellationToken cancellationToken) =>
        await Query().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Internship>> GetFeaturedAsync(CancellationToken cancellationToken) =>
        await Query().Where(internship => internship.Featured).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<string>> GetTitlesAsync(CancellationToken cancellationToken) =>
        await context.Internships.AsNoTracking().Select(internship => internship.Title).ToListAsync(cancellationToken);

    public Task<int> CountAsync(CancellationToken cancellationToken) =>
        context.Internships.CountAsync(cancellationToken);
}
