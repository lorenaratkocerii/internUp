using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence.Repositories;

internal sealed class EfCompanyRepository(InternUpDbContext context) : ICompanyRepository
{
    public async Task<IReadOnlyList<Company>> GetPartnersAsync(CancellationToken cancellationToken) =>
        await context.Companies
            .AsNoTracking()
            .Where(company => company.IsPartner)
            .OrderBy(company => company.DisplayOrder)
            .ToListAsync(cancellationToken);

    public Task<int> CountAsync(CancellationToken cancellationToken) =>
        context.Companies.CountAsync(cancellationToken);
}
