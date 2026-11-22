using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class CityConfiguration : IEntityTypeConfiguration<City>
{
    public void Configure(EntityTypeBuilder<City> builder)
    {
        builder.ToTable("qytetet");
        builder.HasKey(city => city.Id);

        builder.Property(city => city.Name).HasMaxLength(100).IsRequired();
        builder.HasIndex(city => city.Name).IsUnique();
    }
}
