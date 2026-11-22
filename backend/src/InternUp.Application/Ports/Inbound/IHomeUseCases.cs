using InternUp.Application.Home.Dtos;

namespace InternUp.Application.Ports.Inbound;

public interface IHomeUseCases
{
    Task<IReadOnlyList<PlatformStatDto>> GetPlatformStatsAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<PartnerCompanyDto>> GetPartnerCompaniesAsync(CancellationToken cancellationToken);
    Task<SearchOptionsDto> GetSearchOptionsAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<InternshipCardDto>> SearchInternshipsAsync(string? position, string? location, CancellationToken cancellationToken);
}
