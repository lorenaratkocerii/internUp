using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Enums;

public enum UniversityType
{
    Public,
    Private,
}

public static class UniversityTypeExtensions
{
    public static string ToDisplay(this UniversityType type) => type switch
    {
        UniversityType.Public => "publik",
        UniversityType.Private => "privat",
        _ => throw new DomainException($"Lloj i panjohur universiteti: {type}"),
    };

    public static UniversityType Parse(string value) => value switch
    {
        "publik" => UniversityType.Public,
        "privat" => UniversityType.Private,
        _ => throw new DomainException($"Lloj i panjohur universiteti: {value}"),
    };
}
