using InternUp.Domain.Entities;

namespace InternUp.Application.Ports.Outbound;

public interface IInternshipSkillRepository
{
    Task<IReadOnlyList<InternshipSkill>> GetAllAsync(CancellationToken cancellationToken);
    Task<InternshipSkill?> FindAsync(int id, CancellationToken cancellationToken);
    void Add(InternshipSkill skill);
    void Remove(InternshipSkill skill);
}
