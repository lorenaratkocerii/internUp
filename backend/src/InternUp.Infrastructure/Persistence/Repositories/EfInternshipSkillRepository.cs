using InternUp.Application.Ports.Outbound;
using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence.Repositories;

internal sealed class EfInternshipSkillRepository(InternUpDbContext context) : IInternshipSkillRepository
{
    public async Task<IReadOnlyList<InternshipSkill>> GetAllAsync(CancellationToken cancellationToken) =>
        await context.InternshipSkills.AsNoTracking().OrderBy(skill => skill.Id).ToListAsync(cancellationToken);

    public Task<InternshipSkill?> FindAsync(int id, CancellationToken cancellationToken) =>
        context.InternshipSkills.FirstOrDefaultAsync(skill => skill.Id == id, cancellationToken);

    public void Add(InternshipSkill skill) => context.InternshipSkills.Add(skill);

    public void Remove(InternshipSkill skill) => context.InternshipSkills.Remove(skill);
}
