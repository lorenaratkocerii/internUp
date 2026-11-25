using InternUp.Application.Exceptions;
using InternUp.Application.Ports.Inbound;
using InternUp.Application.Ports.Outbound;
using InternUp.Application.Verifications.Dtos;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using InternUp.Domain.Exceptions;
using InternUp.Domain.Search;

namespace InternUp.Application.Verifications;

public sealed class VerificationService(
    IVerificationRepository verifications,
    IUniversityRepository universities,
    IUnitOfWork unitOfWork,
    TimeProvider timeProvider) : IVerificationUseCases
{
    public async Task<VerificationListDto> SearchAsync(
        string? universityId,
        string? studentEmail,
        string? status,
        int? page,
        int? pageSize,
        CancellationToken cancellationToken)
    {
        var criteria = VerificationSearchCriteria.Create(universityId, studentEmail, status, page, pageSize);
        var items = await verifications.SearchAsync(criteria, cancellationToken);
        var totalCount = await verifications.CountAsync(criteria, cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)criteria.PageSize);
        return new VerificationListDto(items.Select(ToDto).ToList(), totalCount, criteria.Page, criteria.PageSize, totalPages);
    }

    public async Task<VerificationDto> GetByIdAsync(string id, CancellationToken cancellationToken) =>
        ToDto(await FindOrThrowAsync(id, cancellationToken));

    public async Task<VerificationDto> SubmitAsync(SubmitVerificationRequest request, CancellationToken cancellationToken)
    {
        var id = RequireId(request.Id);
        if (await verifications.ExistsAsync(id, cancellationToken))
        {
            throw new ConflictException($"Kërkesa me id \"{id}\" ekziston tashmë.");
        }

        var verification = StudentVerification.Create(
            id,
            request.UniversityId,
            request.Student?.Email ?? "",
            request.Student?.Name,
            request.StudentNumber,
            request.UniversityEmail,
            request.Faculty,
            request.Program,
            request.StudyYear,
            timeProvider.GetUtcNow());

        if (!await universities.ExistsAsync(verification.UniversityId, cancellationToken))
        {
            throw new NotFoundException("Ky universitet nuk ekziston.");
        }

        var latest = await verifications.FindLatestForStudentAsync(verification.StudentEmail, cancellationToken);
        if (latest != null && latest.Status == VerificationStatus.Verified)
        {
            throw new ConflictException("Je verifikuar tashmë si student.");
        }
        if (latest != null && latest.Status == VerificationStatus.Pending)
        {
            throw new ConflictException("Ke një kërkesë që po shqyrtohet. Prit përgjigjen e universitetit.");
        }

        verifications.Add(verification);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(verification);
    }

    public async Task<VerificationDto> DecideAsync(string id, DecideVerificationRequest request, CancellationToken cancellationToken)
    {
        var verification = await FindOrThrowAsync(id, cancellationToken);
        var status = VerificationStatusExtensions.Parse(request.Status);

        var latest = await verifications.FindLatestForStudentAsync(verification.StudentEmail, cancellationToken);
        if (latest != null && latest.Id != verification.Id)
        {
            throw new ConflictException("Studenti ka dërguar një kërkesë më të re. Rifresko faqen dhe shqyrto atë.");
        }

        if (status == VerificationStatus.Verified)
        {
            var others = await verifications.FindVerifiedByStudentNumberAsync(
                verification.UniversityId,
                verification.StudentNumber,
                cancellationToken);
            foreach (var other in others.Where(other => other.StudentEmail != verification.StudentEmail))
            {
                var otherLatest = await verifications.FindLatestForStudentAsync(other.StudentEmail, cancellationToken);
                if (otherLatest?.Id == other.Id)
                {
                    throw new ConflictException(
                        $"Indeksi {verification.StudentNumber} është verifikuar tashmë për {other.StudentName}. Një indeks i takon vetëm një studenti.");
                }
            }
        }

        verification.Decide(status, request.Note, request.DecidedBy, timeProvider.GetUtcNow());
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(verification);
    }

    private async Task<StudentVerification> FindOrThrowAsync(string id, CancellationToken cancellationToken) =>
        await verifications.FindAsync(id.Trim(), cancellationToken)
            ?? throw new NotFoundException("Kjo kërkesë nuk ekziston më.");

    private static string RequireId(string? id) =>
        string.IsNullOrWhiteSpace(id) ? throw new DomainException("ID është e detyrueshme.") : id.Trim();

    private static VerificationDto ToDto(StudentVerification verification) => new(
        verification.Id,
        verification.UniversityId,
        new VerificationStudentDto(verification.StudentEmail, verification.StudentName),
        verification.StudentNumber,
        verification.UniversityEmail,
        verification.Faculty,
        verification.Program,
        verification.StudyYear,
        verification.Status.ToDisplay(),
        verification.SubmittedAt,
        verification.DecidedAt,
        verification.DecidedBy,
        verification.Note);
}
