using System.Text.RegularExpressions;
using InternUp.Domain.Enums;
using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Entities;

public sealed class University
{
    private readonly List<UniversityEmailDomain> _emailDomains = [];
    private readonly List<UniversityAlias> _aliases = [];

    private University() { }

    public string Id { get; private set; } = null!;
    public string Name { get; private set; } = null!;
    public string ShortName { get; private set; } = null!;
    public UniversityType Type { get; private set; }
    public string City { get; private set; } = null!;
    public string Logo { get; private set; } = string.Empty;
    public string Photo { get; private set; } = string.Empty;
    public string Website { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string RepresentativeName { get; private set; } = string.Empty;
    public string RepresentativeTitle { get; private set; } = string.Empty;
    public string RepresentativeEmail { get; private set; } = string.Empty;
    public int DisplayOrder { get; private set; }
    public IReadOnlyCollection<UniversityEmailDomain> EmailDomains => _emailDomains.AsReadOnly();
    public IReadOnlyCollection<UniversityAlias> Aliases => _aliases.AsReadOnly();

    public bool HasRepresentative =>
        RepresentativeName.Length > 0 || RepresentativeTitle.Length > 0 || RepresentativeEmail.Length > 0;

    public static University Create(
        string id,
        string name,
        string? shortName,
        UniversityType type,
        string city,
        string? logo,
        string? photo,
        string? website,
        string? description,
        IEnumerable<string>? emailDomains,
        IEnumerable<string>? aliases,
        string? representativeName,
        string? representativeTitle,
        string? representativeEmail,
        int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new DomainException("Një universitet duhet të ketë id, emër dhe qytet.");
        }

        id = id.Trim().ToLowerInvariant();
        if (id.Length > 100 || !Regex.IsMatch(id, "^[a-z0-9]+(-[a-z0-9]+)*$"))
        {
            throw new DomainException("ID e universitetit duhet të ketë vetëm shkronja të vogla, numra dhe viza (p.sh. uni-prizren).");
        }

        var university = new University { Id = id };
        university.Update(
            name,
            shortName,
            type,
            city,
            logo,
            photo,
            website,
            description,
            emailDomains,
            aliases,
            representativeName,
            representativeTitle,
            representativeEmail,
            displayOrder);
        return university;
    }

    public void Update(
        string name,
        string? shortName,
        UniversityType type,
        string city,
        string? logo,
        string? photo,
        string? website,
        string? description,
        IEnumerable<string>? emailDomains,
        IEnumerable<string>? aliases,
        string? representativeName,
        string? representativeTitle,
        string? representativeEmail,
        int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(city))
        {
            throw new DomainException("Një universitet duhet të ketë id, emër dhe qytet.");
        }
        if (displayOrder < 0)
        {
            throw new DomainException("Renditja duhet të jetë numër i plotë jo negativ.");
        }
        if (!Enum.IsDefined(type))
        {
            throw new DomainException($"Lloj i panjohur universiteti: {type}");
        }

        name = name.Trim();
        shortName = string.IsNullOrWhiteSpace(shortName) ? name : shortName.Trim();
        city = city.Trim();
        logo = logo?.Trim() ?? string.Empty;
        photo = photo?.Trim() ?? string.Empty;
        website = website?.Trim() ?? string.Empty;
        description = description?.Trim() ?? string.Empty;
        representativeName = representativeName?.Trim() ?? string.Empty;
        representativeTitle = representativeTitle?.Trim() ?? string.Empty;
        representativeEmail = representativeEmail?.Trim() ?? string.Empty;

        CheckLength(name, 200, "Emri");
        CheckLength(shortName, 120, "Emri i shkurtër");
        CheckLength(city, 100, "Qyteti");
        CheckLength(logo, 300, "Logo");
        CheckLength(photo, 300, "Foto");
        CheckLength(website, 300, "Website");
        CheckLength(description, 5000, "Përshkrimi");
        CheckLength(representativeName, 150, "Emri i përfaqësuesit");
        CheckLength(representativeTitle, 150, "Roli i përfaqësuesit");
        CheckLength(representativeEmail, 150, "Emaili i përfaqësuesit");

        if (website.Length > 0 && !Regex.IsMatch(website, @"^https?://[^\s.]+(\.[^\s.]+)+", RegexOptions.IgnoreCase))
        {
            throw new DomainException("Website duhet të fillojë me https:// ose http://.");
        }
        if (representativeEmail.Length > 0 && !Regex.IsMatch(representativeEmail, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
        {
            throw new DomainException("Shkruaj një adresë emaili të vlefshme për përfaqësuesin.");
        }

        var domains = (emailDomains ?? [])
            .Where(domain => !string.IsNullOrWhiteSpace(domain))
            .Select(domain => domain.Trim().ToLower().TrimStart('@'))
            .Distinct()
            .ToList();
        foreach (var domain in domains)
        {
            if (domain.Length > 120 || !Regex.IsMatch(domain, @"^[a-z0-9-]+(\.[a-z0-9-]+)+$"))
            {
                throw new DomainException($"Domeni \"{domain}\" nuk është i vlefshëm. Shkruaj domenet si p.sh. uni-pr.edu.");
            }
        }

        var aliasNames = (aliases ?? [])
            .Where(alias => !string.IsNullOrWhiteSpace(alias))
            .Select(alias => alias.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
        if (aliasNames.Any(alias => alias.Length > 200))
        {
            throw new DomainException("Një alias nuk mund të ketë më shumë se 200 karaktere.");
        }

        Name = name;
        ShortName = shortName;
        Type = type;
        City = city;
        Logo = logo;
        Photo = photo;
        Website = website;
        Description = description;
        RepresentativeName = representativeName;
        RepresentativeTitle = representativeTitle;
        RepresentativeEmail = representativeEmail;
        DisplayOrder = displayOrder;

        _emailDomains.Clear();
        _emailDomains.AddRange(domains.Select(domain => new UniversityEmailDomain(domain)));
        _aliases.Clear();
        _aliases.AddRange(aliasNames.Select(alias => new UniversityAlias(alias)));
    }

    private static void CheckLength(string value, int maxLength, string field)
    {
        if (value.Length > maxLength)
        {
            throw new DomainException($"{field} nuk mund të ketë më shumë se {maxLength} karaktere.");
        }
    }
}
