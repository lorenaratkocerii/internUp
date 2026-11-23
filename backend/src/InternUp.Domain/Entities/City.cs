using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Entities;

public sealed class City
{
    private City() { }

    public int Id { get; private set; }
    public string Name { get; private set; } = null!;

    public static City Create(string name)
    {
        var city = new City();
        city.Rename(name);
        return city;
    }

    public void Rename(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Qyteti duhet të ketë emër.");
        }
        Name = name.Trim();
    }
}
