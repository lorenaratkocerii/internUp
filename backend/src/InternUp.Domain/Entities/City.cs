using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Entities;

public sealed class City
{
    private City() { }

    public int Id { get; private set; }
    public string Name { get; private set; } = null!;

    public static City Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Qyteti duhet të ketë emër.");
        }
        return new City { Name = name.Trim() };
    }
}
