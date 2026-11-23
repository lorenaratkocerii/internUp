using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence.Repositories;

internal sealed class EfCompanyRepository(InternUpDbContext context) : ICompanyRepository
{
    public async Task<IReadOnlyList<Company>> GetAllAsync(CancellationToken cancellationToken) =>
        await context.Companies
            .AsNoTracking()
            .OrderBy(company => company.DisplayOrder)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Company>> GetPartnersAsync(CancellationToken cancellationToken) =>
        await context.Companies
            .AsNoTracking()
            .Where(company => company.IsPartner)
            .OrderBy(company => company.DisplayOrder)
            .ToListAsync(cancellationToken);

    public Task<int> CountAsync(CancellationToken cancellationToken) =>
        context.Companies.CountAsync(cancellationToken);

    public Task<Company?> FindAsync(string id, CancellationToken cancellationToken) =>
        context.Companies.FirstOrDefaultAsync(company => company.Id == id, cancellationToken);

    public Task<bool> ExistsAsync(string id, CancellationToken cancellationToken) =>
        context.Companies.AnyAsync(company => company.Id == id, cancellationToken);

    public void Add(Company company) => context.Companies.Add(company);

    public void Remove(Company company) => context.Companies.Remove(company);
}
