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
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new DomainException("Një kompani duhet të ketë id, emër, industri dhe lokacion.");
        }

        var company = new Company { Id = id.Trim() };
        company.Update(name, industry, location, shortDescription, isPartner, displayOrder);
        return company;
    }

    public void Update(
        string name,
        string industry,
        string location,
        string? shortDescription,
        bool isPartner,
        int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(industry) || string.IsNullOrWhiteSpace(location))
        {
            throw new DomainException("Një kompani duhet të ketë id, emër, industri dhe lokacion.");
        }

        Name = name.Trim();
        Industry = industry.Trim();
        Location = location.Trim();
        ShortDescription = shortDescription?.Trim() ?? string.Empty;
        IsPartner = isPartner;
        DisplayOrder = displayOrder;
    }
}
