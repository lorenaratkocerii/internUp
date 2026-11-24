using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class UniversityEmailDomainConfiguration : IEntityTypeConfiguration<UniversityEmailDomain>
{
    public void Configure(EntityTypeBuilder<UniversityEmailDomain> builder)
    {
        builder.ToTable("domenet_universiteteve");
        builder.HasKey(domain => domain.Id);

        builder.Property(domain => domain.UniversityId).HasMaxLength(100).IsRequired();
        builder.Property(domain => domain.Domain).HasMaxLength(120).IsRequired();

        builder.HasIndex(domain => new { domain.UniversityId, domain.Domain }).IsUnique();
    }
}
