using InternUp.Domain.Entities;

namespace InternUp.Application.Ports.Outbound;

public interface ICompanyRepository
{
    Task<IReadOnlyList<Company>> GetAllAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<Company>> GetPartnersAsync(CancellationToken cancellationToken);
    Task<int> CountAsync(CancellationToken cancellationToken);
    Task<Company?> FindAsync(string id, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(string id, CancellationToken cancellationToken);
    void Add(Company company);
    void Remove(Company company);
}
