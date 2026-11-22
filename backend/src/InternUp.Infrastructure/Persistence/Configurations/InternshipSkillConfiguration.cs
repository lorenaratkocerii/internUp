using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class InternshipSkillConfiguration : IEntityTypeConfiguration<InternshipSkill>
{
    public void Configure(EntityTypeBuilder<InternshipSkill> builder)
    {
        builder.ToTable("aftesite_praktikave");
        builder.HasKey(skill => skill.Id);

        builder.Property(skill => skill.InternshipId).HasMaxLength(100).IsRequired();
        builder.Property(skill => skill.Name).HasMaxLength(60).IsRequired();

        builder.HasIndex(skill => new { skill.InternshipId, skill.Name }).IsUnique();
    }
}
