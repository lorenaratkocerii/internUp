using InternUp.Domain.Entities;

namespace InternUp.Application.Ports.Outbound;

public interface IInternshipRepository
{
    Task<IReadOnlyList<Internship>> GetAllAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<Internship>> GetFeaturedAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<string>> GetTitlesAsync(CancellationToken cancellationToken);
    Task<int> CountAsync(CancellationToken cancellationToken);
    Task<Internship?> FindAsync(string id, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(string id, CancellationToken cancellationToken);
    void Add(Internship internship);
    void Remove(Internship internship);
}
