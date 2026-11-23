using InternUp.Domain.Enums;
using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Entities;

public sealed class Internship
{
    public const int ClosingSoonDays = 7;

    private readonly List<InternshipSkill> _skills = [];

    private Internship() { }

    public string Id { get; private set; } = null!;
    public string Title { get; private set; } = null!;
    public string CompanyId { get; private set; } = null!;
    public Company Company { get; private set; } = null!;
    public string Location { get; private set; } = null!;
    public WorkMode WorkMode { get; private set; }
    public int DurationMonths { get; private set; }
    public string Schedule { get; private set; } = string.Empty;
    public bool Paid { get; private set; }
    public decimal? Stipend { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public DateOnly OpensAt { get; private set; }
    public DateOnly ClosesAt { get; private set; }
    public int Seats { get; private set; }
    public bool Featured { get; private set; }
    public int DisplayOrder { get; private set; }
    public IReadOnlyCollection<InternshipSkill> Skills => _skills.AsReadOnly();

    public static Internship Create(
        string id,
        string title,
        string companyId,
        string location,
        WorkMode workMode,
        int durationMonths,
        string? schedule,
        bool paid,
        decimal? stipend,
        string? description,
        IEnumerable<string> skills,
        DateOnly opensAt,
        DateOnly closesAt,
        int seats,
        bool featured,
        int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new DomainException("Një praktikë duhet të ketë id, titull, kompani dhe lokacion.");
        }

        var internship = new Internship { Id = id.Trim() };
        internship.Update(
            title,
            companyId,
            location,
            workMode,
            durationMonths,
            schedule,
            paid,
            stipend,
            description,
            opensAt,
            closesAt,
            seats,
            featured,
            displayOrder);

        var distinctSkills = skills
            .Select(skill => skill.Trim())
            .Where(skill => skill.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase);
        internship._skills.AddRange(distinctSkills.Select(skill => new InternshipSkill(skill)));

        return internship;
    }

    public void Update(
        string title,
        string companyId,
        string location,
        WorkMode workMode,
        int durationMonths,
        string? schedule,
        bool paid,
        decimal? stipend,
        string? description,
        DateOnly opensAt,
        DateOnly closesAt,
        int seats,
        bool featured,
        int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(companyId) || string.IsNullOrWhiteSpace(location))
        {
            throw new DomainException("Një praktikë duhet të ketë id, titull, kompani dhe lokacion.");
        }
        if (durationMonths <= 0)
        {
            throw new DomainException("Kohëzgjatja e praktikës duhet të jetë numër i plotë pozitiv.");
        }
        if (closesAt < opensAt)
        {
            throw new DomainException("Data e mbylljes së aplikimit nuk mund të jetë para datës së hapjes.");
        }
        if (seats < 0)
        {
            throw new DomainException("Numri i vendeve të lira duhet të jetë numër i plotë jo negativ.");
        }

        Title = title.Trim();
        CompanyId = companyId.Trim();
        Location = location.Trim();
        WorkMode = workMode;
        DurationMonths = durationMonths;
        Schedule = schedule?.Trim() ?? string.Empty;
        Paid = paid;
        Stipend = paid && stipend > 0 ? stipend : null;
        Description = description?.Trim() ?? string.Empty;
        OpensAt = opensAt;
        ClosesAt = closesAt;
        Seats = seats;
        Featured = featured;
        DisplayOrder = displayOrder;
    }

    public ApplicationStatus GetStatus(DateOnly today)
    {
        if (today < OpensAt || today > ClosesAt || Seats == 0)
        {
            return ApplicationStatus.Closed;
        }

        var daysLeft = ClosesAt.DayNumber - today.DayNumber;
        return daysLeft <= ClosingSoonDays ? ApplicationStatus.ClosingSoon : ApplicationStatus.Open;
    }
}
