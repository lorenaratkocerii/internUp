using System.Globalization;
using InternUp.Application.Home.Dtos;
using InternUp.Application.Ports.Inbound;
using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using InternUp.Domain.Search;

namespace InternUp.Application.Home;

public sealed class HomeService(
    IInternshipRepository internships,
    ICompanyRepository companies,
    ICityRepository cities,
    IPlatformStatRepository stats,
    TimeProvider timeProvider) : IHomeUseCases
{
    private static readonly StringComparer AlbanianOrder =
        StringComparer.Create(CultureInfo.GetCultureInfo("sq"), ignoreCase: false);

    public async Task<IReadOnlyList<PlatformStatDto>> GetPlatformStatsAsync(CancellationToken cancellationToken)
    {
        var stored = await stats.GetAllAsync(cancellationToken);
        var internshipCount = await internships.CountAsync(cancellationToken);
        var companyCount = await companies.CountAsync(cancellationToken);

        return stored
            .Select(stat => new PlatformStatDto(
                stat.Id,
                stat.Id switch
                {
                    PlatformStat.InternshipsKey => internshipCount,
                    PlatformStat.CompaniesKey => companyCount,
                    _ => stat.Value,
                },
                stat.Label))
            .ToList();
    }

    public async Task<IReadOnlyList<PartnerCompanyDto>> GetPartnerCompaniesAsync(CancellationToken cancellationToken)
    {
        var partners = await companies.GetPartnersAsync(cancellationToken);
        return partners
            .Select(company => new PartnerCompanyDto(company.Id, company.Name, company.Industry, company.Location))
            .ToList();
    }

    public async Task<SearchOptionsDto> GetSearchOptionsAsync(CancellationToken cancellationToken)
    {
        var titles = await internships.GetTitlesAsync(cancellationToken);
        var cityNames = await cities.GetNamesAsync(cancellationToken);
        return new SearchOptionsDto(UniqueSorted(titles), UniqueSorted(cityNames));
    }

    public async Task<IReadOnlyList<InternshipCardDto>> SearchInternshipsAsync(
        string? position,
        string? location,
        CancellationToken cancellationToken)
    {
        var criteria = InternshipSearchCriteria.Create(position, location);
        var found = criteria.IsEmpty
            ? await internships.GetFeaturedAsync(cancellationToken)
            : InternshipSearch.FindMatching(await internships.GetAllAsync(cancellationToken), criteria);

        var today = DateOnly.FromDateTime(timeProvider.GetLocalNow().DateTime);
        return found.Select(internship => ToCard(internship, today)).ToList();
    }

    private static InternshipCardDto ToCard(Internship internship, DateOnly today)
    {
        var status = internship.GetStatus(today);
        return new InternshipCardDto(
            internship.Id,
            internship.Title,
            internship.CompanyId,
            internship.Company.Name,
            internship.Location,
            internship.WorkMode.ToDisplay(),
            internship.DurationMonths,
            internship.Schedule,
            internship.Paid,
            internship.Stipend,
            internship.Skills.Select(skill => skill.Name).ToList(),
            internship.OpensAt,
            internship.ClosesAt,
            internship.Seats,
            internship.Featured,
            status.ToDisplay(),
            status != ApplicationStatus.Closed);
    }

    private static IReadOnlyList<string> UniqueSorted(IEnumerable<string> values) =>
        values.Distinct().Order(AlbanianOrder).ToList();
}
