using InternUp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class StudentProfileConfiguration : IEntityTypeConfiguration<StudentProfile>
{
    public void Configure(EntityTypeBuilder<StudentProfile> builder)
    {
        builder.ToTable("StudentProfiles");
        builder.HasKey(profile => profile.UserId);
        builder.Property(profile => profile.UserId).HasColumnType("char(36)").UseCollation("ascii_general_ci");
        ConfigureText(builder.Property(profile => profile.FirstName), 100);
        ConfigureText(builder.Property(profile => profile.LastName), 100);
        ConfigureText(builder.Property(profile => profile.Phone), 40);
        ConfigureText(builder.Property(profile => profile.City), 100);
        ConfigureText(builder.Property(profile => profile.Country), 100);
        ConfigureText(builder.Property(profile => profile.University), 200);
        ConfigureText(builder.Property(profile => profile.Faculty), 150);
        ConfigureText(builder.Property(profile => profile.StudyProgram), 150);
        ConfigureText(builder.Property(profile => profile.StudyYear), 40);
        ConfigureText(builder.Property(profile => profile.GraduationYear), 10);
        ConfigureText(builder.Property(profile => profile.Gpa), 30);
        ConfigureText(builder.Property(profile => profile.Github), 500);
        ConfigureText(builder.Property(profile => profile.Portfolio), 500);
        ConfigureText(builder.Property(profile => profile.Cv), 500);
        ConfigureText(builder.Property(profile => profile.Transcript), 500);
        builder.Property(profile => profile.DetailsJson).HasColumnType("longtext").IsRequired();
        builder.HasOne<User>().WithOne().HasForeignKey<StudentProfile>(profile => profile.UserId).OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureText(PropertyBuilder<string> property, int maxLength) => property.HasMaxLength(maxLength).IsRequired();
}
