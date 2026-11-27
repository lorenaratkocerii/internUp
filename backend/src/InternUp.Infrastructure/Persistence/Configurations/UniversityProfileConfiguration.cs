using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class UniversityProfileConfiguration : IEntityTypeConfiguration<UniversityProfile>
{
    public void Configure(EntityTypeBuilder<UniversityProfile> builder)
    {
        builder.ToTable("UniversityProfiles");
        builder.HasKey(profile => profile.UserId);
        builder.Property(profile => profile.UserId).HasColumnType("char(36)").UseCollation("ascii_general_ci");
        builder.Property(profile => profile.UniversityId).HasMaxLength(100);
        builder.Property(profile => profile.UniversityName).HasMaxLength(200).IsRequired();
        builder.Property(profile => profile.RepresentativeName).HasMaxLength(150).IsRequired();
        builder.Property(profile => profile.RepresentativeTitle).HasMaxLength(150).IsRequired();
        builder.Property(profile => profile.Phone).HasMaxLength(40).IsRequired();
        builder.Property(profile => profile.DetailsJson).HasColumnType("longtext").IsRequired();
        builder.HasOne<User>().WithOne().HasForeignKey<UniversityProfile>(profile => profile.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<University>().WithMany().HasForeignKey(profile => profile.UniversityId).OnDelete(DeleteBehavior.SetNull);
    }
}
