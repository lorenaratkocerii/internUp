using InternUp.Application.Exceptions;
using InternUp.Application.Ports.Inbound;
using InternUp.Application.Ports.Outbound;
using InternUp.Application.Universities.Dtos;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using InternUp.Domain.Exceptions;
using InternUp.Domain.Search;

namespace InternUp.Application.Universities;

public sealed class UniversityService(IUniversityRepository universities, IUnitOfWork unitOfWork) : IUniversityUseCases
{
    public async Task<UniversityListDto> SearchAsync(
        string? query,
        string? type,
        string? city,
        int? page,
        int? pageSize,
        CancellationToken cancellationToken)
    {
        var criteria = UniversitySearchCriteria.Create(query, type, city, page, pageSize);
        var items = await universities.SearchAsync(criteria, cancellationToken);
        var totalCount = await universities.CountAsync(criteria, cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)criteria.PageSize);
        return new UniversityListDto(items.Select(ToDto).ToList(), totalCount, criteria.Page, criteria.PageSize, totalPages);
    }

    public async Task<UniversityDto> GetByIdAsync(string id, CancellationToken cancellationToken) =>
        ToDto(await FindOrThrowAsync(id, cancellationToken));

    public async Task<UniversityDto> CreateAsync(SaveUniversityRequest request, CancellationToken cancellationToken)
    {
        var id = RequireId(request.Id);
        if (await universities.ExistsAsync(id, cancellationToken))
        {
            throw new ConflictException($"Universiteti me id \"{id}\" ekziston tashmë.");
        }

        var university = University.Create(
            id,
            request.Name,
            request.ShortName,
            UniversityTypeExtensions.Parse(request.Type),
            request.City,
            request.Logo,
            request.Photo,
            request.Website,
            request.Description,
            request.EmailDomains,
            request.Aliases,
            request.Representative?.Name,
            request.Representative?.Title,
            request.Representative?.Email,
            request.DisplayOrder ?? await universities.GetNextDisplayOrderAsync(cancellationToken));
        await EnsureNameIsFreeAsync(university.Name, null, cancellationToken);
        universities.Add(university);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(university);
    }

    public async Task<UniversityDto> UpdateAsync(string id, SaveUniversityRequest request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Id) && !string.Equals(request.Id.Trim(), id, StringComparison.OrdinalIgnoreCase))
        {
            throw new DomainException("ID në trup nuk përputhet me ID-në në adresë.");
        }

        var university = await FindOrThrowAsync(id, cancellationToken);
        university.Update(
            request.Name,
            request.ShortName,
            UniversityTypeExtensions.Parse(request.Type),
            request.City,
            request.Logo,
            request.Photo,
            request.Website,
            request.Description,
            request.EmailDomains,
            request.Aliases,
            request.Representative?.Name,
            request.Representative?.Title,
            request.Representative?.Email,
            request.DisplayOrder ?? university.DisplayOrder);
        await EnsureNameIsFreeAsync(university.Name, university.Id, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ToDto(university);
    }

    public async Task DeleteAsync(string id, CancellationToken cancellationToken)
    {
        var university = await FindOrThrowAsync(id, cancellationToken);
        universities.Remove(university);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<University> FindOrThrowAsync(string id, CancellationToken cancellationToken) =>
        await universities.FindAsync(id.Trim().ToLowerInvariant(), cancellationToken)
            ?? throw new NotFoundException($"Universiteti \"{id}\" nuk u gjet.");

    private async Task EnsureNameIsFreeAsync(string? name, string? exceptId, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(name) && await universities.NameExistsAsync(name, exceptId, cancellationToken))
        {
            throw new ConflictException($"Një universitet me emrin \"{name.Trim()}\" ekziston tashmë.");
        }
    }

    private static string RequireId(string? id) =>
        string.IsNullOrWhiteSpace(id) ? throw new DomainException("ID është e detyrueshme.") : id.Trim().ToLowerInvariant();

    private static UniversityDto ToDto(University university) => new(
        university.Id,
        university.Name,
        university.ShortName,
        university.Type.ToDisplay(),
        university.City,
        university.Logo,
        university.Photo,
        university.Website,
        university.EmailDomains.OrderBy(domain => domain.Id).Select(domain => domain.Domain).ToList(),
        university.Description,
        university.Aliases.OrderBy(alias => alias.Id).Select(alias => alias.Name).ToList(),
        university.HasRepresentative
            ? new UniversityRepresentativeDto(
                university.RepresentativeName,
                university.RepresentativeTitle,
                university.RepresentativeEmail)
            : null,
        university.DisplayOrder);
}
