namespace InternUp.Application.Ports.Outbound;

public interface ICityRepository
{
    Task<IReadOnlyList<string>> GetNamesAsync(CancellationToken cancellationToken);
}
