using InternUp.Domain.Exceptions;

namespace InternUp.Domain.Enums;

public enum VerificationStatus
{
    Pending,
    Verified,
    Rejected,
}

public static class VerificationStatusExtensions
{
    public static string ToDisplay(this VerificationStatus status) => status switch
    {
        VerificationStatus.Pending => "pending",
        VerificationStatus.Verified => "verified",
        VerificationStatus.Rejected => "rejected",
        _ => throw new DomainException($"Status i panjohur: {status}"),
    };

    public static VerificationStatus Parse(string value) => value switch
    {
        "pending" => VerificationStatus.Pending,
        "verified" => VerificationStatus.Verified,
        "rejected" => VerificationStatus.Rejected,
        _ => throw new DomainException($"Status i panjohur: {value}"),
    };

    public static string ToLabel(this VerificationStatus status) => status switch
    {
        VerificationStatus.Pending => "Në pritje",
        VerificationStatus.Verified => "I verifikuar",
        VerificationStatus.Rejected => "I refuzuar",
        _ => status.ToString(),
    };
}
