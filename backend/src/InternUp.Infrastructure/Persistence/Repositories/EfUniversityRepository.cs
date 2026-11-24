using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using InternUp.Domain.Search;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence.Repositories;

internal sealed class EfUniversityRepository(InternUpDbContext context) : IUniversityRepository
{
    private IQueryable<University> Filter(UniversitySearchCriteria criteria)
    {
        var query = context.Set<University>().AsNoTracking();

        if (criteria.Type != null)
        {
            query = query.Where(university => university.Type == criteria.Type);
        }
        if (criteria.City.Length > 0)
        {
            query = query.Where(university => university.City == criteria.City);
        }
        foreach (var word in criteria.Words)
        {
            query = query.Where(university =>
                university.Name.Contains(word) ||
                university.ShortName.Contains(word) ||
                university.City.Contains(word) ||
                university.Aliases.Any(alias => alias.Name.Contains(word)));
        }
        return query;
    }

    public async Task<IReadOnlyList<University>> SearchAsync(UniversitySearchCriteria criteria, CancellationToken cancellationToken) =>
        await Filter(criteria)
            .OrderBy(university => university.DisplayOrder)
            .ThenBy(university => university.Name)
            .Skip((criteria.Page - 1) * criteria.PageSize)
            .Take(criteria.PageSize)
            .Include(university => university.EmailDomains.OrderBy(domain => domain.Id))
            .Include(university => university.Aliases.OrderBy(alias => alias.Id))
            .AsSplitQuery()
            .ToListAsync(cancellationToken);

    public Task<int> CountAsync(UniversitySearchCriteria criteria, CancellationToken cancellationToken) =>
        Filter(criteria).CountAsync(cancellationToken);

    public Task<University?> FindAsync(string id, CancellationToken cancellationToken) =>
        context.Set<University>()
            .Include(university => university.EmailDomains)
            .Include(university => university.Aliases)
            .AsSplitQuery()
            .FirstOrDefaultAsync(university => university.Id == id, cancellationToken);

    public Task<bool> ExistsAsync(string id, CancellationToken cancellationToken) =>
        context.Set<University>().AnyAsync(university => university.Id == id, cancellationToken);

    public Task<bool> NameExistsAsync(string name, string? exceptId, CancellationToken cancellationToken)
    {
        var trimmedName = name.Trim();
        return context.Set<University>().AnyAsync(
            university => university.Name == trimmedName && university.Id != exceptId,
            cancellationToken);
    }

    public async Task<int> GetNextDisplayOrderAsync(CancellationToken cancellationToken)
    {
        if (!await context.Set<University>().AnyAsync(cancellationToken))
        {
            return 1;
        }
        return await context.Set<University>().MaxAsync(university => university.DisplayOrder, cancellationToken) + 1;
    }

    public void Add(University university) => context.Set<University>().Add(university);

    public void Remove(University university) => context.Set<University>().Remove(university);
}
