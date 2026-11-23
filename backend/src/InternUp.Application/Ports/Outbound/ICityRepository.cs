using InternUp.Domain.Entities;

namespace InternUp.Application.Ports.Outbound;

public interface ICityRepository
{
    Task<IReadOnlyList<City>> GetAllAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<string>> GetNamesAsync(CancellationToken cancellationToken);
    Task<City?> FindAsync(int id, CancellationToken cancellationToken);
    void Add(City city);
    void Remove(City city);
}
