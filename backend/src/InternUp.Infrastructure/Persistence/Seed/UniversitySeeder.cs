using System.Text.Json;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace InternUp.Infrastructure.Persistence.Seed;

internal sealed class UniversitySeeder(InternUpDbContext context, ILogger<UniversitySeeder> logger)
{
    private const string ResourceName = "InternUp.Infrastructure.Persistence.Seed.university-seed.json";

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        if (await context.Set<University>().AnyAsync(cancellationToken))
        {
            logger.LogInformation("Tabela e universiteteve ka të dhëna; seed-i i universiteteve u anashkalua.");
            return;
        }

        var seed = await LoadSeedAsync(cancellationToken);
        context.Set<University>().AddRange(seed.Universities.Select(university => University.Create(
            university.Id,
            university.Name,
            university.ShortName,
            UniversityTypeExtensions.Parse(university.Type),
            university.City,
            university.Logo,
            university.Photo,
            university.Website,
            university.Description,
            university.EmailDomains,
            university.Aliases,
            university.Representative?.Name,
            university.Representative?.Title,
            university.Representative?.Email,
            university.DisplayOrder)));

        await context.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seed-i i universiteteve përfundoi: {Universities} universitete.", seed.Universities.Count);
    }

    private static async Task<UniversitySeedFile> LoadSeedAsync(CancellationToken cancellationToken)
    {
        await using var stream = typeof(UniversitySeeder).Assembly.GetManifestResourceStream(ResourceName)
            ?? throw new InvalidOperationException($"Skedari i seed-it '{ResourceName}' nuk u gjet.");
        return await JsonSerializer.DeserializeAsync<UniversitySeedFile>(stream, JsonOptions, cancellationToken)
            ?? throw new InvalidOperationException("Skedari i seed-it të universiteteve është bosh.");
    }

    private sealed record UniversitySeedFile(List<UniversitySeed> Universities);

    private sealed record UniversitySeed(
        string Id,
        string Name,
        string ShortName,
        string Type,
        string City,
        string Logo,
        string Photo,
        string Website,
        List<string> EmailDomains,
        string Description,
        List<string> Aliases,
        RepresentativeSeed? Representative,
        int DisplayOrder);

    private sealed record RepresentativeSeed(string Name, string Title, string Email);
}
