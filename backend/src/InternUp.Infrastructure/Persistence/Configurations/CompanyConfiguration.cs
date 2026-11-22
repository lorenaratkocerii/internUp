using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.ToTable("kompanite");
        builder.HasKey(company => company.Id);

        builder.Property(company => company.Id).HasMaxLength(100);
        builder.Property(company => company.Name).HasMaxLength(150).IsRequired();
        builder.Property(company => company.Industry).HasMaxLength(100).IsRequired();
        builder.Property(company => company.Location).HasMaxLength(100).IsRequired();
        builder.Property(company => company.ShortDescription).HasMaxLength(300).IsRequired();

        builder.HasIndex(company => new { company.IsPartner, company.DisplayOrder });
    }
}
