using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Entities;

public sealed class PlatformStat
{
    public const string InternshipsKey = "internships";
    public const string CompaniesKey = "companies";

    private PlatformStat() { }

    public string Id { get; private set; } = null!;
    public string Label { get; private set; } = null!;
    public int Value { get; private set; }
    public int DisplayOrder { get; private set; }

    public static PlatformStat Create(string id, string label, int value, int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new DomainException("Një statistikë duhet të ketë id dhe etiketë.");
        }

        var stat = new PlatformStat { Id = id.Trim() };
        stat.Update(label, value, displayOrder);
        return stat;
    }

    public void Update(string label, int value, int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(label))
        {
            throw new DomainException("Një statistikë duhet të ketë id dhe etiketë.");
        }
        if (value < 0)
        {
            throw new DomainException("Vlera e statistikës nuk mund të jetë negative.");
        }

        Label = label.Trim();
        Value = value;
        DisplayOrder = displayOrder;
    }
}
