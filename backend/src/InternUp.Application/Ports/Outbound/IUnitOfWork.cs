namespace InternUp.Application.Ports.Outbound;

public interface IUnitOfWork
{
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
