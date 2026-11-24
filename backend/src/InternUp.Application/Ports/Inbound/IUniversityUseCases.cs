using InternUp.Application.Universities.Dtos;

namespace InternUp.Application.Ports.Inbound;

public interface IUniversityUseCases
{
    Task<UniversityListDto> SearchAsync(
        string? query,
        string? type,
        string? city,
        int? page,
        int? pageSize,
        CancellationToken cancellationToken);
    Task<UniversityDto> GetByIdAsync(string id, CancellationToken cancellationToken);
    Task<UniversityDto> CreateAsync(SaveUniversityRequest request, CancellationToken cancellationToken);
    Task<UniversityDto> UpdateAsync(string id, SaveUniversityRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(string id, CancellationToken cancellationToken);
}
