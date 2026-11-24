using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class UniversityAliasConfiguration : IEntityTypeConfiguration<UniversityAlias>
{
    public void Configure(EntityTypeBuilder<UniversityAlias> builder)
    {
        builder.ToTable("aliaset_universiteteve");
        builder.HasKey(alias => alias.Id);

        builder.Property(alias => alias.UniversityId).HasMaxLength(100).IsRequired();
        builder.Property(alias => alias.Name).HasMaxLength(200).IsRequired();

        builder.HasIndex(alias => alias.UniversityId);
    }
}
