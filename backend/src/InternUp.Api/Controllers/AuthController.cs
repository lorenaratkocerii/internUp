using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using InternUp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(InternUpDbContext db, IConfiguration configuration) : ControllerBase
{
    private static readonly PasswordHasher<User> PasswordHasher = new();

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (request.Password.Length < 8) return BadRequest(new { title = "Fjalëkalimi duhet t’i ketë së paku 8 karaktere." });
        if (!TryParseRole(request.Role, out var role) || role == UserRole.Admin)
            return BadRequest(new { title = "Roli i zgjedhur nuk mund të regjistrohet." });
        if (await db.Users.AnyAsync(user => user.Email == email, cancellationToken))
            return Conflict(new { title = "Ky email është regjistruar tashmë." });

        var user = new User { Id = Guid.NewGuid(), Email = email, Role = role, CreatedAt = DateTime.UtcNow };
        user.PasswordHash = PasswordHasher.HashPassword(user, request.Password);
        db.Users.Add(user);
        var details = request.Profile.ValueKind == JsonValueKind.Undefined ? "{}" : request.Profile.GetRawText();
        var name = SaveRoleProfile(user.Id, role, request.Profile, details);
        await db.SaveChangesAsync(cancellationToken);
        return Ok(CreateResponse(user, name, details));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(item => item.Email == email, cancellationToken);
        if (user is null || PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            return Unauthorized(new { title = "Emaili ose fjalëkalimi nuk është i saktë." });
        var (name, details) = await LoadRoleProfile(user, cancellationToken);
        return Ok(CreateResponse(user, name, details));
    }

    private string SaveRoleProfile(Guid userId, UserRole role, JsonElement profile, string details)
    {
        string Value(string name) => ReadString(profile, name);
        switch (role)
        {
            case UserRole.Student:
                db.StudentProfiles.Add(new StudentProfile
                {
                    UserId = userId, FirstName = Value("firstName"), LastName = Value("lastName"), Phone = Value("phone"),
                    City = Value("city"), Country = Value("country"), University = Value("university"), Faculty = Value("faculty"),
                    StudyProgram = Value("studyProgram"), StudyYear = Value("studyYear"), GraduationYear = Value("graduationYear"),
                    Gpa = Value("gpa"), Github = Value("github"), Portfolio = Value("portfolio"), Cv = Value("cv"),
                    Transcript = Value("transcript"), DetailsJson = details,
                });
                return string.Join(" ", new[] { Value("firstName"), Value("lastName") }.Where(value => value.Length > 0));
            case UserRole.Company:
                db.CompanyProfiles.Add(new CompanyProfile
                {
                    UserId = userId, CompanyName = Value("name"), Website = Value("website"), Industry = Value("industry"),
                    Size = Value("size"), Country = Value("country"), City = Value("city"), Address = Value("address"), DetailsJson = details,
                });
                return Value("name");
            case UserRole.University:
                var universityId = Value("universityId");
                db.UniversityProfiles.Add(new UniversityProfile
                {
                    UserId = userId, UniversityId = string.IsNullOrWhiteSpace(universityId) ? null : universityId,
                    UniversityName = Value("name"), RepresentativeName = Value("representativeName"),
                    RepresentativeTitle = Value("representativeTitle"), Phone = Value("phone"), DetailsJson = details,
                });
                return Value("representativeName");
            default:
                throw new InvalidOperationException("Roli nuk ka profil të regjistrueshëm.");
        }
    }

    private async Task<(string Name, string Details)> LoadRoleProfile(User user, CancellationToken cancellationToken)
    {
        switch (user.Role)
        {
            case UserRole.Student:
                var student = await db.StudentProfiles.AsNoTracking().SingleOrDefaultAsync(item => item.UserId == user.Id, cancellationToken);
                return (student is null ? string.Empty : string.Join(" ", new[] { student.FirstName, student.LastName }.Where(value => value.Length > 0)), student?.DetailsJson ?? "{}");
            case UserRole.Company:
                var company = await db.CompanyProfiles.AsNoTracking().SingleOrDefaultAsync(item => item.UserId == user.Id, cancellationToken);
                return (company?.CompanyName ?? string.Empty, company?.DetailsJson ?? "{}");
            case UserRole.University:
                var university = await db.UniversityProfiles.AsNoTracking().SingleOrDefaultAsync(item => item.UserId == user.Id, cancellationToken);
                return (university?.RepresentativeName ?? string.Empty, university?.DetailsJson ?? "{}");
            default:
                return ("Administratori", "{}");
        }
    }

    private static string ReadString(JsonElement element, string property) =>
        element.ValueKind == JsonValueKind.Object && element.TryGetProperty(property, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()?.Trim() ?? string.Empty
            : string.Empty;

    private AuthResponse CreateResponse(User user, string name, string profileJson)
    {
        var secret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Mungon konfigurimi Jwt:Secret.");
        var now = DateTimeOffset.UtcNow;
        var header = Encode(JsonSerializer.SerializeToUtf8Bytes(new { alg = "HS256", typ = "JWT" }));
        var role = ToClientRole(user.Role);
        var payload = Encode(JsonSerializer.SerializeToUtf8Bytes(new
        {
            sub = user.Id.ToString(), email = user.Email, name, role,
            iss = configuration["Jwt:Issuer"] ?? "InternUp", aud = configuration["Jwt:Audience"] ?? "InternUp.Client",
            iat = now.ToUnixTimeSeconds(), exp = now.AddHours(8).ToUnixTimeSeconds(),
        }));
        var unsigned = $"{header}.{payload}";
        var signature = HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), Encoding.UTF8.GetBytes(unsigned));
        var token = $"{unsigned}.{Encode(signature)}";
        JsonElement profile;
        try { profile = JsonSerializer.Deserialize<JsonElement>(profileJson); }
        catch (JsonException) { profile = JsonDocument.Parse("{}").RootElement.Clone(); }
        var title = user.Role switch { UserRole.Student => "Student", UserRole.Company => "Kompani", UserRole.University => "Universitet", _ => "Admin" };
        return new AuthResponse(token, new AuthUser(user.Id, user.Email, name, role, title, profile));
    }

    private static string ToClientRole(UserRole role) => role switch
    {
        UserRole.Student => "student", UserRole.Company => "kompani", UserRole.University => "universitet", _ => "admin",
    };

    private static bool TryParseRole(string role, out UserRole parsed) => Enum.TryParse(role switch
    {
        "student" => "Student", "kompani" or "company" => "Company", "universitet" or "university" => "University", "admin" => "Admin", _ => role,
    }, true, out parsed);

    private static string Encode(byte[] bytes) => Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    public sealed record RegisterRequest(string Email, string Password, string Role, string Name, JsonElement Profile);
    public sealed record LoginRequest(string Email, string Password);
    public sealed record AuthResponse(string Token, AuthUser User);
    public sealed record AuthUser(Guid Id, string Email, string Name, string Role, string Title, JsonElement Profile);
}
