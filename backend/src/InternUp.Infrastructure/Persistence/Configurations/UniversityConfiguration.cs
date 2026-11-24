using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class UniversityConfiguration : IEntityTypeConfiguration<University>
{
    public void Configure(EntityTypeBuilder<University> builder)
    {
        builder.ToTable("universitetet");
        builder.HasKey(university => university.Id);

        builder.Property(university => university.Id).HasMaxLength(100);
        builder.Property(university => university.Name).HasMaxLength(200).IsRequired();
        builder.Property(university => university.ShortName).HasMaxLength(120).IsRequired();
        builder.Property(university => university.Type)
            .HasConversion(type => type.ToDisplay(), value => UniversityTypeExtensions.Parse(value))
            .HasMaxLength(20)
            .IsRequired();
        builder.Property(university => university.City).HasMaxLength(100).IsRequired();
        builder.Property(university => university.Logo).HasMaxLength(300).IsRequired();
        builder.Property(university => university.Photo).HasMaxLength(300).IsRequired();
        builder.Property(university => university.Website).HasMaxLength(300).IsRequired();
        builder.Property(university => university.Description).HasColumnType("text").IsRequired();
        builder.Property(university => university.RepresentativeName).HasMaxLength(150).IsRequired();
        builder.Property(university => university.RepresentativeTitle).HasMaxLength(150).IsRequired();
        builder.Property(university => university.RepresentativeEmail).HasMaxLength(150).IsRequired();

        builder.HasMany(university => university.EmailDomains)
            .WithOne()
            .HasForeignKey(domain => domain.UniversityId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(university => university.EmailDomains).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasMany(university => university.Aliases)
            .WithOne()
            .HasForeignKey(alias => alias.UniversityId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(university => university.Aliases).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(university => university.Name).IsUnique();
        builder.HasIndex(university => university.DisplayOrder);
        builder.HasIndex(university => new { university.Type, university.City });
    }
}
