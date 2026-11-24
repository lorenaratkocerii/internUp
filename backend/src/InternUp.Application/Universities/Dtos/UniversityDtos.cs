namespace InternUp.Application.Universities.Dtos;

public sealed record UniversityRepresentativeDto(string? Name, string? Title, string? Email);

public sealed record UniversityDto(
    string Id,
    string Name,
    string ShortName,
    string Type,
    string City,
    string Logo,
    string Photo,
    string Website,
    IReadOnlyList<string> EmailDomains,
    string Description,
    IReadOnlyList<string> Aliases,
    UniversityRepresentativeDto? Representative,
    int DisplayOrder);

public sealed record UniversityListDto(IReadOnlyList<UniversityDto> Items, int TotalCount, int Page, int PageSize, int TotalPages);

public sealed record SaveUniversityRequest(
    string? Id,
    string Name,
    string? ShortName,
    string Type,
    string City,
    string? Logo,
    string? Photo,
    string? Website,
    IReadOnlyList<string>? EmailDomains,
    string? Description,
    IReadOnlyList<string>? Aliases,
    UniversityRepresentativeDto? Representative,
    int? DisplayOrder);
