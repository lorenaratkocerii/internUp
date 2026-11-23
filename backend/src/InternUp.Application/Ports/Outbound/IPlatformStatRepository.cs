using InternUp.Domain.Entities;

namespace InternUp.Application.Ports.Outbound;

public interface IPlatformStatRepository
{
    Task<IReadOnlyList<PlatformStat>> GetAllAsync(CancellationToken cancellationToken);
    Task<PlatformStat?> FindAsync(string id, CancellationToken cancellationToken);
    void Add(PlatformStat stat);
    void Remove(PlatformStat stat);
}
