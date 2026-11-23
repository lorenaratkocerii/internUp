using InternUp.Domain.Exceptions;

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

    public static InternshipSkill Create(string internshipId, string name)
    {
        var skill = new InternshipSkill();
        skill.Update(internshipId, name);
        return skill;
    }

    public void Update(string internshipId, string name)
    {
        if (string.IsNullOrWhiteSpace(internshipId) || string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Një aftësi duhet të ketë praktikë dhe emër.");
        }

        InternshipId = internshipId.Trim();
        Name = name.Trim();
    }
}
