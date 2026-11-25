using InternUp.Application.Ports.Outbound;
using InternUp.Infrastructure.Persistence;
using InternUp.Infrastructure.Persistence.Repositories;
using InternUp.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace InternUp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("InternUpDb")
            ?? throw new InvalidOperationException("Mungon ConnectionStrings:InternUpDb.");
        var serverVersion = ServerVersion.Parse(configuration["Database:ServerVersion"] ?? "8.0.36-mysql");

        services.AddDbContext<InternUpDbContext>(options =>
            options.UseMySql(connectionString, serverVersion, mySql =>
                mySql.MigrationsAssembly(typeof(InternUpDbContext).Assembly.FullName)
                    .MigrationsHistoryTable("historia_migrimeve")));

        services.TryAddSingleton(TimeProvider.System);
        services.AddScoped<IInternshipRepository, EfInternshipRepository>();
        services.AddScoped<ICompanyRepository, EfCompanyRepository>();
        services.AddScoped<ICityRepository, EfCityRepository>();
        services.AddScoped<IPlatformStatRepository, EfPlatformStatRepository>();
        services.AddScoped<IInternshipSkillRepository, EfInternshipSkillRepository>();
        services.AddScoped<IUnitOfWork, EfUnitOfWork>();
        services.AddScoped<DatabaseSeeder>();
        services.AddScoped<IUniversityRepository, EfUniversityRepository>();
        services.AddScoped<UniversitySeeder>();
        services.AddScoped<IVerificationRepository, EfVerificationRepository>();
        services.AddScoped<VerificationSeeder>();

        return services;
    }

    public static async Task InitializeDatabaseAsync(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var context = scope.ServiceProvider.GetRequiredService<InternUpDbContext>();
        await context.Database.MigrateAsync(cancellationToken);
        await scope.ServiceProvider.GetRequiredService<DatabaseSeeder>().SeedAsync(cancellationToken);
        await scope.ServiceProvider.GetRequiredService<UniversitySeeder>().SeedAsync(cancellationToken);
        await scope.ServiceProvider.GetRequiredService<VerificationSeeder>().SeedAsync(cancellationToken);
    }
}
