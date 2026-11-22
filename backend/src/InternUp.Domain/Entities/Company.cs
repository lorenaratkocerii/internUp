using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Entities;

public sealed class Company
{
    private Company() { }

    public string Id { get; private set; } = null!;
    public string Name { get; private set; } = null!;
    public string Industry { get; private set; } = null!;
    public string Location { get; private set; } = null!;
    public string ShortDescription { get; private set; } = string.Empty;
    public bool IsPartner { get; private set; }
    public int DisplayOrder { get; private set; }

    public static Company Create(
        string id,
        string name,
        string industry,
        string location,
        string? shortDescription,
        bool isPartner,
        int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(name)
            || string.IsNullOrWhiteSpace(industry) || string.IsNullOrWhiteSpace(location))
        {
            throw new DomainException("Një kompani duhet të ketë id, emër, industri dhe lokacion.");
        }

        return new Company
        {
            Id = id.Trim(),
            Name = name.Trim(),
            Industry = industry.Trim(),
            Location = location.Trim(),
            ShortDescription = shortDescription?.Trim() ?? string.Empty,
            IsPartner = isPartner,
            DisplayOrder = displayOrder,
        };
    }
}
