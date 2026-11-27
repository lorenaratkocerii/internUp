namespace InternUp.Domain.Entities;

public sealed class UniversityProfile
{
    public Guid UserId { get; set; }
    public string? UniversityId { get; set; }
    public string UniversityName { get; set; } = string.Empty;
    public string RepresentativeName { get; set; } = string.Empty;
    public string RepresentativeTitle { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string DetailsJson { get; set; } = "{}";
}
