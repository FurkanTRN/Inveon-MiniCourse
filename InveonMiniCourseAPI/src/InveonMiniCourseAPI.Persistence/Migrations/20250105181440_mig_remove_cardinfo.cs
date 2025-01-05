using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InveonMiniCourseAPI.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class mig_remove_cardinfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CardHolderName",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "EncryptedCardNumber",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "MaskedCardNumber",
                table: "Payments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CardHolderName",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EncryptedCardNumber",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaskedCardNumber",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
