namespace InternUp.Application.Admin.Dtos;

public sealed record AdminCompanyDto(
    string Id,
    string Name,
    string Industry,
    string Location,
    string ShortDescription,
    bool IsPartner,
    int DisplayOrder);

public sealed record AdminInternshipDto(
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
    DateOnly OpensAt,
    DateOnly ClosesAt,
    int Seats,
    bool Featured,
    int DisplayOrder);

public sealed record AdminInternshipSkillDto(int Id, string InternshipId, string Name);

public sealed record AdminCityDto(int Id, string Name);

public sealed record AdminPlatformStatDto(string Id, string Label, int Value, int DisplayOrder);

public sealed record SaveCompanyRequest(
    string? Id,
    string Name,
    string Industry,
    string Location,
    string? ShortDescription,
    bool IsPartner,
    int DisplayOrder);

public sealed record SaveInternshipRequest(
    string? Id,
    string Title,
    string CompanyId,
    string Location,
    string WorkMode,
    int DurationMonths,
    string? Schedule,
    bool Paid,
    decimal? Stipend,
    string? Description,
    DateOnly OpensAt,
    DateOnly ClosesAt,
    int Seats,
    bool Featured,
    int DisplayOrder);

public sealed record SaveInternshipSkillRequest(string InternshipId, string Name);

public sealed record SaveCityRequest(string Name);

public sealed record SavePlatformStatRequest(string? Id, string Label, int Value, int DisplayOrder);
