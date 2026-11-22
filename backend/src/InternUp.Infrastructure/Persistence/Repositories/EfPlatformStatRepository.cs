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
}
