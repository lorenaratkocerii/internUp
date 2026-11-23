using InternUp.Application.Admin.Dtos;
using InternUp.Application.Exceptions;
using InternUp.Application.Ports.Inbound;
using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using InternUp.Domain.Exceptions;

namespace InternUp.Application.Admin;

public sealed class AdminHomeService(
    IInternshipRepository internships,
    ICompanyRepository companies,
    IInternshipSkillRepository skills,
    ICityRepository cities,
    IPlatformStatRepository stats,
    IUnitOfWork unitOfWork) : IAdminHomeUseCases
{
    public async Task<IReadOnlyList<AdminCompanyDto>> GetCompaniesAsync(CancellationToken cancellationToken) =>
        (await companies.GetAllAsync(cancellationToken)).Select(ToDto).ToList();

    public async Task<AdminCompanyDto> CreateCompanyAsync(SaveCompanyRequest request, CancellationToken cancellationToken)
    {
        var id = RequireId(request.Id);
        if (await companies.ExistsAsync(id, cancellationToken))
        {
            throw new ConflictException($"Kompania me id \"{id}\" ekziston tashmë.");
        }

        var company = Company.Create(
            id,
            request.Name,
            request.Industry,
            request.Location,
            request.ShortDescription,
            request.IsPartner,
            request.DisplayOrder);
        companies.Add(company);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(company);
    }

    public async Task<AdminCompanyDto> UpdateCompanyAsync(string id, SaveCompanyRequest request, CancellationToken cancellationToken)
    {
        var company = await companies.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Kompania \"{id}\" nuk u gjet.");
        company.Update(request.Name, request.Industry, request.Location, request.ShortDescription, request.IsPartner, request.DisplayOrder);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(company);
    }

    public async Task DeleteCompanyAsync(string id, CancellationToken cancellationToken)
    {
        var company = await companies.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Kompania \"{id}\" nuk u gjet.");
        companies.Remove(company);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AdminInternshipDto>> GetInternshipsAsync(CancellationToken cancellationToken) =>
        (await internships.GetAllAsync(cancellationToken)).Select(ToDto).ToList();

    public async Task<AdminInternshipDto> CreateInternshipAsync(SaveInternshipRequest request, CancellationToken cancellationToken)
    {
        var id = RequireId(request.Id);
        if (await internships.ExistsAsync(id, cancellationToken))
        {
            throw new ConflictException($"Praktika me id \"{id}\" ekziston tashmë.");
        }
        await EnsureCompanyExistsAsync(request.CompanyId, cancellationToken);

        var internship = Internship.Create(
            id,
            request.Title,
            request.CompanyId,
            request.Location,
            WorkModeExtensions.Parse(request.WorkMode),
            request.DurationMonths,
            request.Schedule,
            request.Paid,
            request.Stipend,
            request.Description,
            [],
            request.OpensAt,
            request.ClosesAt,
            request.Seats,
            request.Featured,
            request.DisplayOrder);
        internships.Add(internship);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(internship);
    }

    public async Task<AdminInternshipDto> UpdateInternshipAsync(string id, SaveInternshipRequest request, CancellationToken cancellationToken)
    {
        var internship = await internships.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Praktika \"{id}\" nuk u gjet.");
        await EnsureCompanyExistsAsync(request.CompanyId, cancellationToken);

        internship.Update(
            request.Title,
            request.CompanyId,
            request.Location,
            WorkModeExtensions.Parse(request.WorkMode),
            request.DurationMonths,
            request.Schedule,
            request.Paid,
            request.Stipend,
            request.Description,
            request.OpensAt,
            request.ClosesAt,
            request.Seats,
            request.Featured,
            request.DisplayOrder);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(internship);
    }

    public async Task DeleteInternshipAsync(string id, CancellationToken cancellationToken)
    {
        var internship = await internships.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Praktika \"{id}\" nuk u gjet.");
        internships.Remove(internship);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AdminInternshipSkillDto>> GetInternshipSkillsAsync(CancellationToken cancellationToken) =>
        (await skills.GetAllAsync(cancellationToken)).Select(ToDto).ToList();

    public async Task<AdminInternshipSkillDto> CreateInternshipSkillAsync(SaveInternshipSkillRequest request, CancellationToken cancellationToken)
    {
        await EnsureInternshipExistsAsync(request.InternshipId, cancellationToken);
        var skill = InternshipSkill.Create(request.InternshipId, request.Name);
        skills.Add(skill);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(skill);
    }

    public async Task<AdminInternshipSkillDto> UpdateInternshipSkillAsync(int id, SaveInternshipSkillRequest request, CancellationToken cancellationToken)
    {
        var skill = await skills.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Aftësia {id} nuk u gjet.");
        await EnsureInternshipExistsAsync(request.InternshipId, cancellationToken);
        skill.Update(request.InternshipId, request.Name);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(skill);
    }

    public async Task DeleteInternshipSkillAsync(int id, CancellationToken cancellationToken)
    {
        var skill = await skills.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Aftësia {id} nuk u gjet.");
        skills.Remove(skill);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AdminCityDto>> GetCitiesAsync(CancellationToken cancellationToken) =>
        (await cities.GetAllAsync(cancellationToken)).Select(ToDto).ToList();

    public async Task<AdminCityDto> CreateCityAsync(SaveCityRequest request, CancellationToken cancellationToken)
    {
        var city = City.Create(request.Name);
        cities.Add(city);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(city);
    }

    public async Task<AdminCityDto> UpdateCityAsync(int id, SaveCityRequest request, CancellationToken cancellationToken)
    {
        var city = await cities.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Qyteti {id} nuk u gjet.");
        city.Rename(request.Name);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(city);
    }

    public async Task DeleteCityAsync(int id, CancellationToken cancellationToken)
    {
        var city = await cities.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Qyteti {id} nuk u gjet.");
        cities.Remove(city);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AdminPlatformStatDto>> GetPlatformStatsAsync(CancellationToken cancellationToken) =>
        (await stats.GetAllAsync(cancellationToken)).Select(ToDto).ToList();

    public async Task<AdminPlatformStatDto> CreatePlatformStatAsync(SavePlatformStatRequest request, CancellationToken cancellationToken)
    {
        var id = RequireId(request.Id);
        if (await stats.FindAsync(id, cancellationToken) is not null)
        {
            throw new ConflictException($"Statistika me id \"{id}\" ekziston tashmë.");
        }

        var stat = PlatformStat.Create(id, request.Label, request.Value, request.DisplayOrder);
        stats.Add(stat);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(stat);
    }

    public async Task<AdminPlatformStatDto> UpdatePlatformStatAsync(string id, SavePlatformStatRequest request, CancellationToken cancellationToken)
    {
        var stat = await stats.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Statistika \"{id}\" nuk u gjet.");
        stat.Update(request.Label, request.Value, request.DisplayOrder);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(stat);
    }

    public async Task DeletePlatformStatAsync(string id, CancellationToken cancellationToken)
    {
        var stat = await stats.FindAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Statistika \"{id}\" nuk u gjet.");
        stats.Remove(stat);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureCompanyExistsAsync(string companyId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(companyId) || !await companies.ExistsAsync(companyId.Trim(), cancellationToken))
        {
            throw new DomainException("Zgjidh një kompani që ekziston.");
        }
    }

    private async Task EnsureInternshipExistsAsync(string internshipId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(internshipId) || !await internships.ExistsAsync(internshipId.Trim(), cancellationToken))
        {
            throw new DomainException("Zgjidh një praktikë që ekziston.");
        }
    }

    private static string RequireId(string? id) =>
        string.IsNullOrWhiteSpace(id) ? throw new DomainException("ID është e detyrueshme.") : id.Trim();

    private static AdminCompanyDto ToDto(Company company) => new(
        company.Id,
        company.Name,
        company.Industry,
        company.Location,
        company.ShortDescription,
        company.IsPartner,
        company.DisplayOrder);

    private static AdminInternshipDto ToDto(Internship internship) => new(
        internship.Id,
        internship.Title,
        internship.CompanyId,
        internship.Location,
        internship.WorkMode.ToDisplay(),
        internship.DurationMonths,
        internship.Schedule,
        internship.Paid,
        internship.Stipend,
        internship.Description,
        internship.OpensAt,
        internship.ClosesAt,
        internship.Seats,
        internship.Featured,
        internship.DisplayOrder);

    private static AdminInternshipSkillDto ToDto(InternshipSkill skill) => new(skill.Id, skill.InternshipId, skill.Name);

    private static AdminCityDto ToDto(City city) => new(city.Id, city.Name);

    private static AdminPlatformStatDto ToDto(PlatformStat stat) => new(stat.Id, stat.Label, stat.Value, stat.DisplayOrder);
}
