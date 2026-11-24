using InternUp.Domain.Enums;

namespace InternUp.Domain.Search;

public sealed record UniversitySearchCriteria
{
    private UniversitySearchCriteria(string[] words, UniversityType? type, string city, int page, int pageSize)
    {
        Words = words;
        Type = type;
        City = city;
        Page = page;
        PageSize = pageSize;
    }

    public string[] Words { get; }
    public UniversityType? Type { get; }
    public string City { get; }
    public int Page { get; }
    public int PageSize { get; }

    public static UniversitySearchCriteria Create(string? query, string? type, string? city, int? page, int? pageSize)
    {
        var words = (query ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);

        UniversityType? universityType = null;
        if (!string.IsNullOrWhiteSpace(type))
        {
            universityType = UniversityTypeExtensions.Parse(type);
        }

        var currentPage = page ?? 1;
        if (currentPage < 1)
        {
            currentPage = 1;
        }

        var size = pageSize ?? 20;
        if (size < 1)
        {
            size = 1;
        }
        if (size > 100)
        {
            size = 100;
        }

        return new UniversitySearchCriteria(words, universityType, city?.Trim() ?? "", currentPage, size);
    }
}
