namespace InternUp.Domain.Entities;

public sealed class UniversityEmailDomain
{
    private UniversityEmailDomain() { }

    internal UniversityEmailDomain(string domain)
    {
        Domain = domain;
    }

    public int Id { get; private set; }
    public string UniversityId { get; private set; } = null!;
    public string Domain { get; private set; } = null!;
}
