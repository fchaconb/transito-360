using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SoloIDMulta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_infraccionMulta_CatalogoInfracciones_idInfraccion",
                table: "infraccionMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_infraccionMulta_Multas_idMulta",
                table: "infraccionMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Multas_idMulta",
                table: "multaPlacas");

            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Placas_idPlaca",
                table: "multaPlacas");

            migrationBuilder.DropIndex(
                name: "IX_infraccionMulta_idMulta",
                table: "infraccionMulta");

            migrationBuilder.AddColumn<int>(
                name: "CatalogoInfraccionesId",
                table: "infraccionMulta",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MultasId",
                table: "infraccionMulta",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_infraccionMulta_CatalogoInfraccionesId",
                table: "infraccionMulta",
                column: "CatalogoInfraccionesId");

            migrationBuilder.CreateIndex(
                name: "IX_infraccionMulta_MultasId",
                table: "infraccionMulta",
                column: "MultasId");

            migrationBuilder.AddForeignKey(
                name: "FK_infraccionMulta_CatalogoInfracciones_CatalogoInfraccionesId",
                table: "infraccionMulta",
                column: "CatalogoInfraccionesId",
                principalTable: "CatalogoInfracciones",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_infraccionMulta_Multas_MultasId",
                table: "infraccionMulta",
                column: "MultasId",
                principalTable: "Multas",
                principalColumn: "Id");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_infraccionMulta_CatalogoInfracciones_CatalogoInfraccionesId",
                table: "infraccionMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_infraccionMulta_Multas_MultasId",
                table: "infraccionMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Multas_idMulta",
                table: "multaPlacas");

            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Placas_idPlaca",
                table: "multaPlacas");

            migrationBuilder.DropIndex(
                name: "IX_infraccionMulta_CatalogoInfraccionesId",
                table: "infraccionMulta");

            migrationBuilder.DropIndex(
                name: "IX_infraccionMulta_MultasId",
                table: "infraccionMulta");

            migrationBuilder.DropColumn(
                name: "CatalogoInfraccionesId",
                table: "infraccionMulta");

            migrationBuilder.DropColumn(
                name: "MultasId",
                table: "infraccionMulta");

            migrationBuilder.CreateIndex(
                name: "IX_infraccionMulta_idMulta",
                table: "infraccionMulta",
                column: "idMulta");

            migrationBuilder.AddForeignKey(
                name: "FK_infraccionMulta_CatalogoInfracciones_idInfraccion",
                table: "infraccionMulta",
                column: "idInfraccion",
                principalTable: "CatalogoInfracciones",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_infraccionMulta_Multas_idMulta",
                table: "infraccionMulta",
                column: "idMulta",
                principalTable: "Multas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_multaPlacas_Multas_idMulta",
                table: "multaPlacas",
                column: "idMulta",
                principalTable: "Multas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_multaPlacas_Placas_idPlaca",
                table: "multaPlacas",
                column: "idPlaca",
                principalTable: "Placas",
                principalColumn: "Id");
        }
    }
}
