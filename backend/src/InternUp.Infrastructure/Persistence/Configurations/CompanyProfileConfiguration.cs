using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class CompanyProfileConfiguration : IEntityTypeConfiguration<CompanyProfile>
{
    public void Configure(EntityTypeBuilder<CompanyProfile> builder)
    {
        builder.ToTable("CompanyProfiles");
        builder.HasKey(profile => profile.UserId);
        builder.Property(profile => profile.UserId).HasColumnType("char(36)").UseCollation("ascii_general_ci");
        builder.Property(profile => profile.CompanyName).HasMaxLength(200).IsRequired();
        builder.Property(profile => profile.Website).HasMaxLength(500).IsRequired();
        builder.Property(profile => profile.Industry).HasMaxLength(150).IsRequired();
        builder.Property(profile => profile.Size).HasMaxLength(30).IsRequired();
        builder.Property(profile => profile.Country).HasMaxLength(100).IsRequired();
        builder.Property(profile => profile.City).HasMaxLength(100).IsRequired();
        builder.Property(profile => profile.Address).HasMaxLength(250).IsRequired();
        builder.Property(profile => profile.DetailsJson).HasColumnType("longtext").IsRequired();
        builder.HasOne<User>().WithOne().HasForeignKey<CompanyProfile>(profile => profile.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
