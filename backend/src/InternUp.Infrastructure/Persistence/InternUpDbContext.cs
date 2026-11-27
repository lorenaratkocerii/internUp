using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InternUp.Infrastructure.Persistence;

public sealed class InternUpDbContext(DbContextOptions<InternUpDbContext> options) : DbContext(options)
{
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<User> Users => Set<User>();
    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
    public DbSet<UniversityProfile> UniversityProfiles => Set<UniversityProfile>();
    public DbSet<CompanyProfile> CompanyProfiles => Set<CompanyProfile>();
    public DbSet<Internship> Internships => Set<Internship>();
    public DbSet<InternshipSkill> InternshipSkills => Set<InternshipSkill>();
    public DbSet<City> Cities => Set<City>();
    public DbSet<PlatformStat> PlatformStats => Set<PlatformStat>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(InternUpDbContext).Assembly);
    }
}
