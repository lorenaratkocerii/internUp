using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class InternshipConfiguration : IEntityTypeConfiguration<Internship>
{
    public void Configure(EntityTypeBuilder<Internship> builder)
    {
        builder.ToTable("praktikat");
        builder.HasKey(internship => internship.Id);

        builder.Property(internship => internship.Id).HasMaxLength(100);
        builder.Property(internship => internship.Title).HasMaxLength(150).IsRequired();
        builder.Property(internship => internship.CompanyId).HasMaxLength(100).IsRequired();
        builder.Property(internship => internship.Location).HasMaxLength(100).IsRequired();
        builder.Property(internship => internship.WorkMode)
            .HasConversion(mode => mode.ToDisplay(), value => WorkModeExtensions.Parse(value))
            .HasMaxLength(20)
            .IsRequired();
        builder.Property(internship => internship.Schedule).HasMaxLength(150).IsRequired();
        builder.Property(internship => internship.Stipend).HasPrecision(10, 2);
        builder.Property(internship => internship.Description).HasColumnType("text").IsRequired();

        builder.HasOne(internship => internship.Company)
            .WithMany()
            .HasForeignKey(internship => internship.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(internship => internship.Skills)
            .WithOne()
            .HasForeignKey(skill => skill.InternshipId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(internship => internship.Skills).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(internship => new { internship.Featured, internship.DisplayOrder });
        builder.HasIndex(internship => internship.Title);
    }
}
