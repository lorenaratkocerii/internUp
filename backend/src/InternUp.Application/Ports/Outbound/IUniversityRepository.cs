using InternUp.Domain.Entities;
using InternUp.Domain.Search;

namespace InternUp.Application.Ports.Outbound;

public interface IUniversityRepository
{
    Task<IReadOnlyList<University>> SearchAsync(UniversitySearchCriteria criteria, CancellationToken cancellationToken);
    Task<int> CountAsync(UniversitySearchCriteria criteria, CancellationToken cancellationToken);
    Task<University?> FindAsync(string id, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(string id, CancellationToken cancellationToken);
    Task<bool> NameExistsAsync(string name, string? exceptId, CancellationToken cancellationToken);
    Task<int> GetNextDisplayOrderAsync(CancellationToken cancellationToken);
    void Add(University university);
    void Remove(University university);
}
