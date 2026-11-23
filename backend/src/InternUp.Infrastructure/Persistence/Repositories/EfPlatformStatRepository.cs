using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence.Repositories;

internal sealed class EfPlatformStatRepository(InternUpDbContext context) : IPlatformStatRepository
{
    public async Task<IReadOnlyList<PlatformStat>> GetAllAsync(CancellationToken cancellationToken) =>
        await context.PlatformStats
            .AsNoTracking()
            .OrderBy(stat => stat.DisplayOrder)
            .ToListAsync(cancellationToken);

    public Task<PlatformStat?> FindAsync(string id, CancellationToken cancellationToken) =>
        context.PlatformStats.FirstOrDefaultAsync(stat => stat.Id == id, cancellationToken);

    public void Add(PlatformStat stat) => context.PlatformStats.Add(stat);

    public void Remove(PlatformStat stat) => context.PlatformStats.Remove(stat);
}
