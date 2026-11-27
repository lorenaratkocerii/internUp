namespace InternUp.Domain.Entities;

public sealed class CompanyProfile
{
    public Guid UserId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string DetailsJson { get; set; } = "{}";
}
