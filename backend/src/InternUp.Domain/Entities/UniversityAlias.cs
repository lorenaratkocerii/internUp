namespace InternUp.Domain.Entities;

public sealed class UniversityAlias
{
    private UniversityAlias() { }

    internal UniversityAlias(string name)
    {
        Name = name;
    }

    public int Id { get; private set; }
    public string UniversityId { get; private set; } = null!;
    public string Name { get; private set; } = null!;
}
