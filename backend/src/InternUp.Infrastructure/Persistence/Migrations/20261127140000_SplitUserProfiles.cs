using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternUp.Infrastructure.Persistence.Migrations;

[DbContext(typeof(InternUpDbContext))]
[Migration("20261127140000_SplitUserProfiles")]
public partial class SplitUserProfiles : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.RenameTable(name: "perdoruesit", newName: "Users");
        CreateProfileTable(migrationBuilder, "StudentProfiles", new[]
        {
            ("FirstName", "varchar(100)", 100), ("LastName", "varchar(100)", 100), ("Phone", "varchar(40)", 40),
            ("City", "varchar(100)", 100), ("Country", "varchar(100)", 100), ("University", "varchar(200)", 200),
            ("Faculty", "varchar(150)", 150), ("StudyProgram", "varchar(150)", 150), ("StudyYear", "varchar(40)", 40),
            ("GraduationYear", "varchar(10)", 10), ("Gpa", "varchar(30)", 30), ("Github", "varchar(500)", 500),
            ("Portfolio", "varchar(500)", 500), ("Cv", "varchar(500)", 500), ("Transcript", "varchar(500)", 500),
        });
        CreateProfileTable(migrationBuilder, "CompanyProfiles", new[]
        {
            ("CompanyName", "varchar(200)", 200), ("Website", "varchar(500)", 500), ("Industry", "varchar(150)", 150),
            ("Size", "varchar(30)", 30), ("Country", "varchar(100)", 100), ("City", "varchar(100)", 100), ("Address", "varchar(250)", 250),
        });
        CreateProfileTable(migrationBuilder, "UniversityProfiles", new[]
        {
            ("UniversityName", "varchar(200)", 200), ("RepresentativeName", "varchar(150)", 150),
            ("RepresentativeTitle", "varchar(150)", 150), ("Phone", "varchar(40)", 40),
        }, hasUniversityId: true);

        migrationBuilder.Sql("INSERT INTO `StudentProfiles` (`UserId`, `DetailsJson`) SELECT `Id`, JSON_SET(COALESCE(`ProfileJson`, '{}'), '$.accountName', `Name`) FROM `Users` WHERE `Role` = 'Student'");
        migrationBuilder.Sql("INSERT INTO `CompanyProfiles` (`UserId`, `DetailsJson`) SELECT `Id`, JSON_SET(COALESCE(`ProfileJson`, '{}'), '$.accountName', `Name`) FROM `Users` WHERE `Role` = 'Company'");
        migrationBuilder.Sql("INSERT INTO `UniversityProfiles` (`UserId`, `DetailsJson`) SELECT `Id`, JSON_SET(COALESCE(`ProfileJson`, '{}'), '$.accountName', `Name`) FROM `Users` WHERE `Role` = 'University'");
        migrationBuilder.DropColumn(name: "ProfileJson", table: "Users");
        migrationBuilder.DropColumn(name: "Name", table: "Users");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(name: "Name", table: "Users", type: "varchar(200)", maxLength: 200, nullable: false, defaultValue: "").Annotation("MySql:CharSet", "utf8mb4");
        migrationBuilder.AddColumn<string>(name: "ProfileJson", table: "Users", type: "longtext", nullable: false, defaultValue: "{}").Annotation("MySql:CharSet", "utf8mb4");
        migrationBuilder.DropTable("StudentProfiles");
        migrationBuilder.DropTable("CompanyProfiles");
        migrationBuilder.DropTable("UniversityProfiles");
        migrationBuilder.RenameTable(name: "Users", newName: "perdoruesit");
    }

    private static void CreateProfileTable(MigrationBuilder migrationBuilder, string table, (string Name, string Type, int Length)[] fields, bool hasUniversityId = false)
    {
        var columns = new System.Collections.Generic.List<string>
        {
            "`UserId` char(36) COLLATE ascii_general_ci NOT NULL",
        };
        if (hasUniversityId) columns.Add("`UniversityId` varchar(100) NULL");
        foreach (var (name, type, _) in fields) columns.Add($"`{name}` {type} NOT NULL DEFAULT ''");
        columns.Add("`DetailsJson` longtext NOT NULL");
        columns.Add($"CONSTRAINT `PK_{table}` PRIMARY KEY (`UserId`)");
        columns.Add($"CONSTRAINT `FK_{table}_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE");
        if (hasUniversityId)
            columns.Add($"CONSTRAINT `FK_{table}_universitetet_UniversityId` FOREIGN KEY (`UniversityId`) REFERENCES `universitetet` (`Id`) ON DELETE SET NULL");
        migrationBuilder.Sql($"CREATE TABLE `{table}` ({string.Join(", ", columns)}) CHARACTER SET=utf8mb4");
    }
}
