using InternUp.Application.Verifications.Dtos;

namespace InternUp.Application.Ports.Inbound;

public interface IVerificationUseCases
{
    Task<VerificationListDto> SearchAsync(
        string? universityId,
        string? studentEmail,
        string? status,
        int? page,
        int? pageSize,
        CancellationToken cancellationToken);
    Task<VerificationDto> GetByIdAsync(string id, CancellationToken cancellationToken);
    Task<VerificationDto> SubmitAsync(SubmitVerificationRequest request, CancellationToken cancellationToken);
    Task<VerificationDto> DecideAsync(string id, DecideVerificationRequest request, CancellationToken cancellationToken);
}
