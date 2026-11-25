using InternUp.Application.Ports.Inbound;
using InternUp.Application.Verifications.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace InternUp.Api.Controllers;

[ApiController]
[Route("api/verifications")]
[Produces("application/json")]
public sealed class VerificationsController(IVerificationUseCases verifications) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<VerificationListDto>> Search(
        string? universityId,
        string? studentEmail,
        string? status,
        int? page,
        int? pageSize,
        CancellationToken cancellationToken) =>
        Ok(await verifications.SearchAsync(universityId, studentEmail, status, page, pageSize, cancellationToken));

    [HttpGet("{id}")]
    public async Task<ActionResult<VerificationDto>> GetById(string id, CancellationToken cancellationToken) =>
        Ok(await verifications.GetByIdAsync(id, cancellationToken));

    [HttpPost]
    public async Task<ActionResult<VerificationDto>> Submit(SubmitVerificationRequest request, CancellationToken cancellationToken) =>
        StatusCode(StatusCodes.Status201Created, await verifications.SubmitAsync(request, cancellationToken));

    [HttpPut("{id}/decision")]
    public async Task<ActionResult<VerificationDto>> Decide(string id, DecideVerificationRequest request, CancellationToken cancellationToken) =>
        Ok(await verifications.DecideAsync(id, request, cancellationToken));
}
