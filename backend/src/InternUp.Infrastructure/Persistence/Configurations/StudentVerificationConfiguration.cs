using InternUp.Domain.Entities;
using InternUp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InternUp.Infrastructure.Persistence.Configurations;

internal sealed class StudentVerificationConfiguration : IEntityTypeConfiguration<StudentVerification>
{
    public void Configure(EntityTypeBuilder<StudentVerification> builder)
    {
        builder.ToTable("verifikimet_studenteve");
        builder.HasKey(verification => verification.Id);

        builder.Property(verification => verification.Id).HasMaxLength(100);
        builder.Property(verification => verification.UniversityId).HasMaxLength(100).IsRequired();
        builder.Property(verification => verification.StudentEmail).HasMaxLength(150).IsRequired();
        builder.Property(verification => verification.StudentName).HasMaxLength(150).IsRequired();
        builder.Property(verification => verification.StudentNumber).HasMaxLength(20).IsRequired();
        builder.Property(verification => verification.UniversityEmail).HasMaxLength(150).IsRequired();
        builder.Property(verification => verification.Faculty).HasMaxLength(150).IsRequired();
        builder.Property(verification => verification.Program).HasMaxLength(150).IsRequired();
        builder.Property(verification => verification.StudyYear).HasMaxLength(30).IsRequired();
        builder.Property(verification => verification.Status)
            .HasConversion(status => status.ToDisplay(), value => VerificationStatusExtensions.Parse(value))
            .HasMaxLength(20)
            .IsRequired();
        builder.Property(verification => verification.DecidedBy).HasMaxLength(150).IsRequired();
        builder.Property(verification => verification.Note).HasMaxLength(500).IsRequired();

        builder.HasOne<University>()
            .WithMany()
            .HasForeignKey(verification => verification.UniversityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(verification => new { verification.UniversityId, verification.Status });
        builder.HasIndex(verification => verification.StudentEmail);
    }
}
