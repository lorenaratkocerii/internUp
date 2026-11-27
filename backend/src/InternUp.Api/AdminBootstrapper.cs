using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using InternUp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Api;

public static class AdminBootstrapper
{
    public static async Task SeedDevelopmentAdminAsync(this IServiceProvider services, IConfiguration configuration)
    {
        var email = configuration["AdminBootstrap:Email"]?.Trim().ToLowerInvariant();
        var password = configuration["AdminBootstrap:Password"];
        if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(password)) return;
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException("AdminBootstrap kërkon email dhe fjalëkalim.");

        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<InternUpDbContext>();
        var admin = await db.Users.SingleOrDefaultAsync(user => user.Role == UserRole.Admin);
        var emailOwner = await db.Users.SingleOrDefaultAsync(user => user.Email == email);
        if (emailOwner is not null && emailOwner.Id != admin?.Id)
            throw new InvalidOperationException("Emaili i AdminBootstrap është përdorur nga një llogari jo-admin.");

        if (admin is not null)
        {
            admin.Email = email;
            admin.PasswordHash = new PasswordHasher<User>().HashPassword(admin, password);
            await db.SaveChangesAsync();
            return;
        }

        admin = new User { Id = Guid.NewGuid(), Email = email, Role = UserRole.Admin, CreatedAt = DateTime.UtcNow };
        admin.PasswordHash = new PasswordHasher<User>().HashPassword(admin, password);
        db.Users.Add(admin);
        await db.SaveChangesAsync();
    }
}
