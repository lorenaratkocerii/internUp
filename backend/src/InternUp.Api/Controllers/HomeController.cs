using InternUp.Application.Home.Dtos;
using InternUp.Application.Ports.Inbound;
using Microsoft.AspNetCore.Mvc;

namespace InternUp.Api.Controllers;

[ApiController]
[Route("api/home")]
[Produces("application/json")]
public sealed class HomeController(IHomeUseCases home) : ControllerBase
{
    [HttpGet("stats")]
    [ProducesResponseType<IReadOnlyList<PlatformStatDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PlatformStatDto>>> GetStats(CancellationToken cancellationToken) =>
        Ok(await home.GetPlatformStatsAsync(cancellationToken));

    [HttpGet("partner-companies")]
    [ProducesResponseType<IReadOnlyList<PartnerCompanyDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PartnerCompanyDto>>> GetPartnerCompanies(CancellationToken cancellationToken) =>
        Ok(await home.GetPartnerCompaniesAsync(cancellationToken));

    [HttpGet("search-options")]
    [ProducesResponseType<SearchOptionsDto>(StatusCodes.Status200OK)]
    public async Task<ActionResult<SearchOptionsDto>> GetSearchOptions(CancellationToken cancellationToken) =>
        Ok(await home.GetSearchOptionsAsync(cancellationToken));

    [HttpGet("internships")]
    [ProducesResponseType<IReadOnlyList<InternshipCardDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<InternshipCardDto>>> SearchInternships(
        [FromQuery] string? position,
        [FromQuery] string? location,
        CancellationToken cancellationToken) =>
        Ok(await home.SearchInternshipsAsync(position, location, cancellationToken));
}
