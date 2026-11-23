using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence.Repositories;

internal sealed class EfCityRepository(InternUpDbContext context) : ICityRepository
{
    public async Task<IReadOnlyList<City>> GetAllAsync(CancellationToken cancellationToken) =>
        await context.Cities.AsNoTracking().OrderBy(city => city.Id).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<string>> GetNamesAsync(CancellationToken cancellationToken) =>
        await context.Cities.AsNoTracking().Select(city => city.Name).ToListAsync(cancellationToken);

    public Task<City?> FindAsync(int id, CancellationToken cancellationToken) =>
        context.Cities.FirstOrDefaultAsync(city => city.Id == id, cancellationToken);

    public void Add(City city) => context.Cities.Add(city);

    public void Remove(City city) => context.Cities.Remove(city);
}
