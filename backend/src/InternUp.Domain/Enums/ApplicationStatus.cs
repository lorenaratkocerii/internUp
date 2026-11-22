namespace InternUp.Domain.Enums;

public enum ApplicationStatus
{
    Open,
    ClosingSoon,
    Closed,
}

public static class ApplicationStatusExtensions
{
    public static string ToDisplay(this ApplicationStatus status) => status switch
    {
        ApplicationStatus.Open => "Open",
        ApplicationStatus.ClosingSoon => "Closing Soon",
        _ => "Closed",
    };
}
