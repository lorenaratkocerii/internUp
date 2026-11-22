using InternUp.Application.Ports.Outbound;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence.Repositories;

internal sealed class EfCityRepository(InternUpDbContext context) : ICityRepository
{
    public async Task<IReadOnlyList<string>> GetNamesAsync(CancellationToken cancellationToken) =>
        await context.Cities.AsNoTracking().Select(city => city.Name).ToListAsync(cancellationToken);
}
