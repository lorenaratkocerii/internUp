namespace InternUp.Application.Home.Dtos;

public sealed record PlatformStatDto(string Id, int Value, string Label);

public sealed record PartnerCompanyDto(string Id, string Name, string Industry, string Location);

public sealed record SearchOptionsDto(IReadOnlyList<string> Positions, IReadOnlyList<string> Locations);

public sealed record InternshipCardDto(
    string Id,
    string Title,
    string CompanyId,
    string Company,
    string Location,
    string WorkMode,
    int DurationMonths,
    string Schedule,
    bool Paid,
    decimal? Stipend,
    IReadOnlyList<string> Skills,
    DateOnly OpensAt,
    DateOnly ClosesAt,
    int Seats,
    bool Featured,
    string Status,
    bool CanApply);
