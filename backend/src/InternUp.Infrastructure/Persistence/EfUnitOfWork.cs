using InternUp.Application.Exceptions;
using InternUp.Application.Ports.Outbound;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence;

internal sealed class EfUnitOfWork(InternUpDbContext context) : IUnitOfWork
{
    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            context.ChangeTracker.Clear();
            throw new ConflictException("Ruajtja dështoi: vlera ekziston tashmë, është shumë e gjatë ose lidhet me rresht që nuk ekziston.");
        }
    }
}
