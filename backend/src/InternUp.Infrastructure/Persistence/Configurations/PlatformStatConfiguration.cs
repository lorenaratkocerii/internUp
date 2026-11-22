using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class PlatformStatConfiguration : IEntityTypeConfiguration<PlatformStat>
{
    public void Configure(EntityTypeBuilder<PlatformStat> builder)
    {
        builder.ToTable("statistikat");
        builder.HasKey(stat => stat.Id);

        builder.Property(stat => stat.Id).HasMaxLength(50);
        builder.Property(stat => stat.Label).HasMaxLength(100).IsRequired();
    }
}
