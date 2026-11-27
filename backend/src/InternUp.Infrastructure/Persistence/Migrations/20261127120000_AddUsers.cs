using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;

#nullable disable

namespace InternUp.Infrastructure.Persistence.Migrations;

[DbContext(typeof(InternUpDbContext))]
[Migration("20261127120000_AddUsers")]
public partial class AddUsers : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "perdoruesit",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                Email = table.Column<string>(type: "varchar(254)", maxLength: 254, nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                ProfileJson = table.Column<string>(type: "longtext", nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                PasswordHash = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Role = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_perdoruesit", x => x.Id))
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(name: "IX_perdoruesit_Email", table: "perdoruesit", column: "Email", unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder) => migrationBuilder.DropTable(name: "perdoruesit");
}
