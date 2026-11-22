using InternUp.Domain.Entities;

namespace InternUp.Application.Ports.Outbound;

public interface IPlatformStatRepository
{
    Task<IReadOnlyList<PlatformStat>> GetAllAsync(CancellationToken cancellationToken);
}
