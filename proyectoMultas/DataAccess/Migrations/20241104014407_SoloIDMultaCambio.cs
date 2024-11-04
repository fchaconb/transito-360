using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SoloIDMultaCambio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Multas_idMulta",
                table: "multaPlacas");

            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Placas_idPlaca",
                table: "multaPlacas");

            migrationBuilder.DropIndex(
                name: "IX_multaPlacas_idPlaca",
                table: "multaPlacas");

            migrationBuilder.AddColumn<int>(
                name: "MultasId",
                table: "multaPlacas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlacasId",
                table: "multaPlacas",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_multaPlacas_MultasId",
                table: "multaPlacas",
                column: "MultasId");

            migrationBuilder.CreateIndex(
                name: "IX_multaPlacas_PlacasId",
                table: "multaPlacas",
                column: "PlacasId");

            migrationBuilder.AddForeignKey(
                name: "FK_multaPlacas_Multas_MultasId",
                table: "multaPlacas",
                column: "MultasId",
                principalTable: "Multas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_multaPlacas_Placas_PlacasId",
                table: "multaPlacas",
                column: "PlacasId",
                principalTable: "Placas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Multas_MultasId",
                table: "multaPlacas");

            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Placas_PlacasId",
                table: "multaPlacas");

            migrationBuilder.DropIndex(
                name: "IX_multaPlacas_MultasId",
                table: "multaPlacas");

            migrationBuilder.DropIndex(
                name: "IX_multaPlacas_PlacasId",
                table: "multaPlacas");

            migrationBuilder.DropColumn(
                name: "MultasId",
                table: "multaPlacas");

            migrationBuilder.DropColumn(
                name: "PlacasId",
                table: "multaPlacas");

            migrationBuilder.CreateIndex(
                name: "IX_multaPlacas_idPlaca",
                table: "multaPlacas",
                column: "idPlaca");

            migrationBuilder.AddForeignKey(
                name: "FK_multaPlacas_Multas_idMulta",
                table: "multaPlacas",
                column: "idMulta",
                principalTable: "Multas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_multaPlacas_Placas_idPlaca",
                table: "multaPlacas",
                column: "idPlaca",
                principalTable: "Placas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
