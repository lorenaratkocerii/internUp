namespace InternUp.Domain.Entities;

public sealed class InternshipSkill
{
    private InternshipSkill() { }

    internal InternshipSkill(string name)
    {
        Name = name;
    }

    public int Id { get; private set; }
    public string InternshipId { get; private set; } = null!;
    public string Name { get; private set; } = null!;
}
