using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Enums;

public enum WorkMode
{
    Remote,
    Hybrid,
    OnSite,
}

public static class WorkModeExtensions
{
    public static string ToDisplay(this WorkMode mode) => mode switch
    {
        WorkMode.Remote => "Remote",
        WorkMode.Hybrid => "Hybrid",
        WorkMode.OnSite => "On-site",
        _ => throw new DomainException($"Mënyrë pune e panjohur: {mode}"),
    };

    public static WorkMode Parse(string value) => value switch
    {
        "Remote" => WorkMode.Remote,
        "Hybrid" => WorkMode.Hybrid,
        "On-site" => WorkMode.OnSite,
        _ => throw new DomainException($"Mënyrë pune e panjohur: {value}"),
    };
}
