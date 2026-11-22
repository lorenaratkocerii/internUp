using System.Text.Json;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace InternUp.Infrastructure.Persistence.Seed;

internal sealed class DatabaseSeeder(InternUpDbContext context, TimeProvider timeProvider, ILogger<DatabaseSeeder> logger)
{
    private const string ResourceName = "InternUp.Infrastructure.Persistence.Seed.home-seed.json";

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        if (await context.Companies.AnyAsync(cancellationToken))
        {
            logger.LogInformation("Databaza ka të dhëna; seed-i u anashkalua.");
            return;
        }

        var seed = await LoadSeedAsync(cancellationToken);
        var today = DateOnly.FromDateTime(timeProvider.GetLocalNow().DateTime);

        context.Cities.AddRange(seed.Cities.Select(City.Create));
        context.Companies.AddRange(seed.Companies.Select(company => Company.Create(
            company.Id,
            company.Name,
            company.Industry,
            company.Location,
            company.ShortDescription,
            company.IsPartner,
            company.DisplayOrder)));
        context.Internships.AddRange(seed.Internships.Select(internship => Internship.Create(
            internship.Id,
            internship.Title,
            internship.CompanyId,
            internship.Location,
            WorkModeExtensions.Parse(internship.WorkMode),
            internship.DurationMonths,
            internship.Schedule,
            internship.Paid,
            internship.Stipend,
            internship.Description,
            internship.Skills,
            today.AddDays(internship.OpensInDays),
            today.AddDays(internship.ClosesInDays),
            internship.Seats,
            internship.Featured,
            internship.DisplayOrder)));
        context.PlatformStats.AddRange(seed.PlatformStats.Select(stat =>
            PlatformStat.Create(stat.Id, stat.Label, stat.Value, stat.DisplayOrder)));

        await context.SaveChangesAsync(cancellationToken);
        logger.LogInformation(
            "Seed-i përfundoi: {Companies} kompani, {Internships} praktika, {Cities} qytete.",
            seed.Companies.Count,
            seed.Internships.Count,
            seed.Cities.Count);
    }

    private static async Task<HomeSeed> LoadSeedAsync(CancellationToken cancellationToken)
    {
        await using var stream = typeof(DatabaseSeeder).Assembly.GetManifestResourceStream(ResourceName)
            ?? throw new InvalidOperationException($"Skedari i seed-it '{ResourceName}' nuk u gjet.");
        return await JsonSerializer.DeserializeAsync<HomeSeed>(stream, JsonOptions, cancellationToken)
            ?? throw new InvalidOperationException("Skedari i seed-it është bosh.");
    }

    private sealed record HomeSeed(
        List<string> Cities,
        List<CompanySeed> Companies,
        List<InternshipSeed> Internships,
        List<PlatformStatSeed> PlatformStats);

    private sealed record CompanySeed(
        string Id,
        string Name,
        string Industry,
        string Location,
        string ShortDescription,
        bool IsPartner,
        int DisplayOrder);

    private sealed record InternshipSeed(
        string Id,
        string Title,
        string CompanyId,
        string Location,
        string WorkMode,
        int DurationMonths,
        string Schedule,
        bool Paid,
        decimal? Stipend,
        string Description,
        List<string> Skills,
        int OpensInDays,
        int ClosesInDays,
        int Seats,
        bool Featured,
        int DisplayOrder);

    private sealed record PlatformStatSeed(string Id, string Label, int Value, int DisplayOrder);
}
