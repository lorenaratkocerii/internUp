using System.Globalization;
using System.Text;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;

namespace InternUp.Domain.Search;

public static class InternshipSearch
{
    public static string Normalize(string? text)
    {
        if (string.IsNullOrEmpty(text)) return string.Empty;

        var decomposed = text.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(decomposed.Length);
        foreach (var character in decomposed)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark)
            {
                builder.Append(character);
            }
        }
        return builder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant().Trim();
    }

    public static bool ContainsAllWords(string haystack, string query)
    {
        var text = Normalize(haystack);
        return Normalize(query)
            .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries)
            .All(text.Contains);
    }

    public static IReadOnlyList<Internship> FindMatching(
        IReadOnlyCollection<Internship> internships,
        InternshipSearchCriteria criteria)
    {
        var query = Normalize(criteria.Position);
        var sameTitle = internships.Where(internship => Normalize(internship.Title) == query).ToList();
        IEnumerable<Internship> pool = sameTitle.Count > 0 ? sameTitle : internships;

        return pool
            .Where(internship =>
            {
                var positionText = string.Join(' ', internship.Skills.Select(skill => skill.Name).Prepend(internship.Title));
                var locationText = $"{internship.Location} {internship.WorkMode.ToDisplay()}";
                return ContainsAllWords(positionText, criteria.Position)
                    && ContainsAllWords(locationText, criteria.Location);
            })
            .ToList();
    }
}
