using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mege.Infrastructure.Data.SQLite.Migrations
{
    public partial class AddSpacing : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SpacingColor",
                table: "MemeTemplates",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SpacingSize",
                table: "MemeTemplates",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SpacingType",
                table: "MemeTemplates",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpacingColor",
                table: "MemeTemplates");

            migrationBuilder.DropColumn(
                name: "SpacingSize",
                table: "MemeTemplates");

            migrationBuilder.DropColumn(
                name: "SpacingType",
                table: "MemeTemplates");
        }
    }
}
