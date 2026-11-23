using InternUp.Application.Admin.Dtos;
using InternUp.Application.Ports.Inbound;
using Microsoft.AspNetCore.Mvc;

namespace InternUp.Api.Controllers;

[ApiController]
[Route("api/admin/home")]
[Produces("application/json")]
public sealed class AdminHomeController(IAdminHomeUseCases admin) : ControllerBase
{
    [HttpGet("kompanite")]
    public async Task<ActionResult<IReadOnlyList<AdminCompanyDto>>> GetCompanies(CancellationToken cancellationToken) =>
        Ok(await admin.GetCompaniesAsync(cancellationToken));

    [HttpPost("kompanite")]
    public async Task<ActionResult<AdminCompanyDto>> CreateCompany(SaveCompanyRequest request, CancellationToken cancellationToken) =>
        StatusCode(StatusCodes.Status201Created, await admin.CreateCompanyAsync(request, cancellationToken));

    [HttpPut("kompanite/{id}")]
    public async Task<ActionResult<AdminCompanyDto>> UpdateCompany(string id, SaveCompanyRequest request, CancellationToken cancellationToken) =>
        Ok(await admin.UpdateCompanyAsync(id, request, cancellationToken));

    [HttpDelete("kompanite/{id}")]
    public async Task<IActionResult> DeleteCompany(string id, CancellationToken cancellationToken)
    {
        await admin.DeleteCompanyAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("praktikat")]
    public async Task<ActionResult<IReadOnlyList<AdminInternshipDto>>> GetInternships(CancellationToken cancellationToken) =>
        Ok(await admin.GetInternshipsAsync(cancellationToken));

    [HttpPost("praktikat")]
    public async Task<ActionResult<AdminInternshipDto>> CreateInternship(SaveInternshipRequest request, CancellationToken cancellationToken) =>
        StatusCode(StatusCodes.Status201Created, await admin.CreateInternshipAsync(request, cancellationToken));

    [HttpPut("praktikat/{id}")]
    public async Task<ActionResult<AdminInternshipDto>> UpdateInternship(string id, SaveInternshipRequest request, CancellationToken cancellationToken) =>
        Ok(await admin.UpdateInternshipAsync(id, request, cancellationToken));

    [HttpDelete("praktikat/{id}")]
    public async Task<IActionResult> DeleteInternship(string id, CancellationToken cancellationToken)
    {
        await admin.DeleteInternshipAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("aftesite_praktikave")]
    public async Task<ActionResult<IReadOnlyList<AdminInternshipSkillDto>>> GetInternshipSkills(CancellationToken cancellationToken) =>
        Ok(await admin.GetInternshipSkillsAsync(cancellationToken));

    [HttpPost("aftesite_praktikave")]
    public async Task<ActionResult<AdminInternshipSkillDto>> CreateInternshipSkill(SaveInternshipSkillRequest request, CancellationToken cancellationToken) =>
        StatusCode(StatusCodes.Status201Created, await admin.CreateInternshipSkillAsync(request, cancellationToken));

    [HttpPut("aftesite_praktikave/{id:int}")]
    public async Task<ActionResult<AdminInternshipSkillDto>> UpdateInternshipSkill(int id, SaveInternshipSkillRequest request, CancellationToken cancellationToken) =>
        Ok(await admin.UpdateInternshipSkillAsync(id, request, cancellationToken));

    [HttpDelete("aftesite_praktikave/{id:int}")]
    public async Task<IActionResult> DeleteInternshipSkill(int id, CancellationToken cancellationToken)
    {
        await admin.DeleteInternshipSkillAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("qytetet")]
    public async Task<ActionResult<IReadOnlyList<AdminCityDto>>> GetCities(CancellationToken cancellationToken) =>
        Ok(await admin.GetCitiesAsync(cancellationToken));

    [HttpPost("qytetet")]
    public async Task<ActionResult<AdminCityDto>> CreateCity(SaveCityRequest request, CancellationToken cancellationToken) =>
        StatusCode(StatusCodes.Status201Created, await admin.CreateCityAsync(request, cancellationToken));

    [HttpPut("qytetet/{id:int}")]
    public async Task<ActionResult<AdminCityDto>> UpdateCity(int id, SaveCityRequest request, CancellationToken cancellationToken) =>
        Ok(await admin.UpdateCityAsync(id, request, cancellationToken));

    [HttpDelete("qytetet/{id:int}")]
    public async Task<IActionResult> DeleteCity(int id, CancellationToken cancellationToken)
    {
        await admin.DeleteCityAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("statistikat")]
    public async Task<ActionResult<IReadOnlyList<AdminPlatformStatDto>>> GetPlatformStats(CancellationToken cancellationToken) =>
        Ok(await admin.GetPlatformStatsAsync(cancellationToken));

    [HttpPost("statistikat")]
    public async Task<ActionResult<AdminPlatformStatDto>> CreatePlatformStat(SavePlatformStatRequest request, CancellationToken cancellationToken) =>
        StatusCode(StatusCodes.Status201Created, await admin.CreatePlatformStatAsync(request, cancellationToken));

    [HttpPut("statistikat/{id}")]
    public async Task<ActionResult<AdminPlatformStatDto>> UpdatePlatformStat(string id, SavePlatformStatRequest request, CancellationToken cancellationToken) =>
        Ok(await admin.UpdatePlatformStatAsync(id, request, cancellationToken));

    [HttpDelete("statistikat/{id}")]
    public async Task<IActionResult> DeletePlatformStat(string id, CancellationToken cancellationToken)
    {
        await admin.DeletePlatformStatAsync(id, cancellationToken);
        return NoContent();
    }
}
