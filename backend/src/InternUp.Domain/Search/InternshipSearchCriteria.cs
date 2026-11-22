namespace InternUp.Domain.Search;

public sealed record InternshipSearchCriteria
{
    private InternshipSearchCriteria(string position, string location)
    {
        Position = position;
        Location = location;
    }

    public string Position { get; }
    public string Location { get; }
    public bool IsEmpty => Position.Length == 0 && Location.Length == 0;

    public static InternshipSearchCriteria Create(string? position, string? location) =>
        new(position?.Trim() ?? string.Empty, location?.Trim() ?? string.Empty);
}
