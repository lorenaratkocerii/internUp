using InternUp.Domain.Entities;

namespace InternUp.Application.Ports.Outbound;

public interface ICompanyRepository
{
    Task<IReadOnlyList<Company>> GetPartnersAsync(CancellationToken cancellationToken);
    Task<int> CountAsync(CancellationToken cancellationToken);
}
