using InternUp.Application.Ports.Inbound;
using InternUp.Application.Universities.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace InternUp.Api.Controllers;

[ApiController]
[Route("api/universities")]
[Produces("application/json")]
public sealed class UniversitiesController(IUniversityUseCases universities) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<UniversityListDto>> Search(
        string? query,
        string? type,
        string? city,
        int? page,
        int? pageSize,
        CancellationToken cancellationToken) =>
        Ok(await universities.SearchAsync(query, type, city, page, pageSize, cancellationToken));

    [HttpGet("{id}")]
    public async Task<ActionResult<UniversityDto>> GetById(string id, CancellationToken cancellationToken) =>
        Ok(await universities.GetByIdAsync(id, cancellationToken));

    [HttpPost]
    public async Task<ActionResult<UniversityDto>> Create(SaveUniversityRequest request, CancellationToken cancellationToken) =>
        StatusCode(StatusCodes.Status201Created, await universities.CreateAsync(request, cancellationToken));

    [HttpPut("{id}")]
    public async Task<ActionResult<UniversityDto>> Update(string id, SaveUniversityRequest request, CancellationToken cancellationToken) =>
        Ok(await universities.UpdateAsync(id, request, cancellationToken));

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        await universities.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
