using System.Text.Json;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace InternUp.Infrastructure.Persistence.Seed;

internal sealed class VerificationSeeder(InternUpDbContext context, TimeProvider timeProvider, ILogger<VerificationSeeder> logger)
{
    private const string ResourceName = "InternUp.Infrastructure.Persistence.Seed.verification-seed.json";

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        if (await context.Set<StudentVerification>().AnyAsync(cancellationToken))
        {
            logger.LogInformation("Tabela e verifikimeve ka të dhëna; seed-i i verifikimeve u anashkalua.");
            return;
        }

        var seed = await LoadSeedAsync(cancellationToken);
        var today = timeProvider.GetUtcNow().UtcDateTime.Date;

        foreach (var item in seed.Verifications)
        {
            var verification = StudentVerification.Create(
                item.Id,
                item.UniversityId,
                item.StudentEmail,
                item.StudentName,
                item.StudentNumber,
                item.UniversityEmail,
                item.Faculty,
                item.Program,
                item.StudyYear,
                new DateTimeOffset(today.AddDays(-item.SubmittedDaysAgo).AddHours(10)));

            if (item.Status != "pending")
            {
                verification.Decide(
                    VerificationStatusExtensions.Parse(item.Status),
                    item.Note,
                    item.DecidedBy,
                    new DateTimeOffset(today.AddDays(-item.DecidedDaysAgo).AddHours(10)));
            }
            context.Set<StudentVerification>().Add(verification);
        }

        await context.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seed-i i verifikimeve përfundoi: {Verifications} kërkesa.", seed.Verifications.Count);
    }

    private static async Task<VerificationSeedFile> LoadSeedAsync(CancellationToken cancellationToken)
    {
        await using var stream = typeof(VerificationSeeder).Assembly.GetManifestResourceStream(ResourceName)
            ?? throw new InvalidOperationException($"Skedari i seed-it '{ResourceName}' nuk u gjet.");
        return await JsonSerializer.DeserializeAsync<VerificationSeedFile>(stream, JsonOptions, cancellationToken)
            ?? throw new InvalidOperationException("Skedari i seed-it të verifikimeve është bosh.");
    }

    private sealed record VerificationSeedFile(List<VerificationSeed> Verifications);

    private sealed record VerificationSeed(
        string Id,
        string UniversityId,
        string StudentEmail,
        string StudentName,
        string StudentNumber,
        string UniversityEmail,
        string Faculty,
        string Program,
        string StudyYear,
        string Status,
        int SubmittedDaysAgo,
        int DecidedDaysAgo,
        string DecidedBy,
        string Note);
}
