using InternUp.Application.Admin.Dtos;

namespace InternUp.Application.Ports.Inbound;

public interface IAdminHomeUseCases
{
    Task<IReadOnlyList<AdminCompanyDto>> GetCompaniesAsync(CancellationToken cancellationToken);
    Task<AdminCompanyDto> CreateCompanyAsync(SaveCompanyRequest request, CancellationToken cancellationToken);
    Task<AdminCompanyDto> UpdateCompanyAsync(string id, SaveCompanyRequest request, CancellationToken cancellationToken);
    Task DeleteCompanyAsync(string id, CancellationToken cancellationToken);

    Task<IReadOnlyList<AdminInternshipDto>> GetInternshipsAsync(CancellationToken cancellationToken);
    Task<AdminInternshipDto> CreateInternshipAsync(SaveInternshipRequest request, CancellationToken cancellationToken);
    Task<AdminInternshipDto> UpdateInternshipAsync(string id, SaveInternshipRequest request, CancellationToken cancellationToken);
    Task DeleteInternshipAsync(string id, CancellationToken cancellationToken);

    Task<IReadOnlyList<AdminInternshipSkillDto>> GetInternshipSkillsAsync(CancellationToken cancellationToken);
    Task<AdminInternshipSkillDto> CreateInternshipSkillAsync(SaveInternshipSkillRequest request, CancellationToken cancellationToken);
    Task<AdminInternshipSkillDto> UpdateInternshipSkillAsync(int id, SaveInternshipSkillRequest request, CancellationToken cancellationToken);
    Task DeleteInternshipSkillAsync(int id, CancellationToken cancellationToken);

    Task<IReadOnlyList<AdminCityDto>> GetCitiesAsync(CancellationToken cancellationToken);
    Task<AdminCityDto> CreateCityAsync(SaveCityRequest request, CancellationToken cancellationToken);
    Task<AdminCityDto> UpdateCityAsync(int id, SaveCityRequest request, CancellationToken cancellationToken);
    Task DeleteCityAsync(int id, CancellationToken cancellationToken);

    Task<IReadOnlyList<AdminPlatformStatDto>> GetPlatformStatsAsync(CancellationToken cancellationToken);
    Task<AdminPlatformStatDto> CreatePlatformStatAsync(SavePlatformStatRequest request, CancellationToken cancellationToken);
    Task<AdminPlatformStatDto> UpdatePlatformStatAsync(string id, SavePlatformStatRequest request, CancellationToken cancellationToken);
    Task DeletePlatformStatAsync(string id, CancellationToken cancellationToken);
}
