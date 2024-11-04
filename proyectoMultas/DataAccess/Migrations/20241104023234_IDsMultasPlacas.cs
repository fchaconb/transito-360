using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class IDsMultasPlacas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_infraccionMulta_CatalogoInfracciones_CatalogoInfraccionesId",
                table: "infraccionMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_infraccionMulta_Multas_MultasId",
                table: "infraccionMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Multas_MultasId",
                table: "multaPlacas");

            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Placas_PlacasId",
                table: "multaPlacas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_multaPlacas",
                table: "multaPlacas");

            migrationBuilder.DropIndex(
                name: "IX_multaPlacas_MultasId",
                table: "multaPlacas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_infraccionMulta",
                table: "infraccionMulta");

            migrationBuilder.DropIndex(
                name: "IX_infraccionMulta_CatalogoInfraccionesId",
                table: "infraccionMulta");

            migrationBuilder.DropColumn(
                name: "idMulta",
                table: "multaPlacas");

            migrationBuilder.DropColumn(
                name: "idPlaca",
                table: "multaPlacas");

            migrationBuilder.DropColumn(
                name: "idInfraccion",
                table: "infraccionMulta");

            migrationBuilder.DropColumn(
                name: "idMulta",
                table: "infraccionMulta");

            migrationBuilder.AlterColumn<string>(
                name: "PlacasId",
                table: "multaPlacas",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MultasId",
                table: "multaPlacas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MultasId",
                table: "infraccionMulta",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CatalogoInfraccionesId",
                table: "infraccionMulta",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_multaPlacas",
                table: "multaPlacas",
                columns: new[] { "MultasId", "PlacasId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_infraccionMulta",
                table: "infraccionMulta",
                columns: new[] { "CatalogoInfraccionesId", "MultasId" });

            migrationBuilder.AddForeignKey(
                name: "FK_infraccionMulta_CatalogoInfracciones_CatalogoInfraccionesId",
                table: "infraccionMulta",
                column: "CatalogoInfraccionesId",
                principalTable: "CatalogoInfracciones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_infraccionMulta_Multas_MultasId",
                table: "infraccionMulta",
                column: "MultasId",
                principalTable: "Multas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_multaPlacas_Multas_MultasId",
                table: "multaPlacas",
                column: "MultasId",
                principalTable: "Multas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_multaPlacas_Placas_PlacasId",
                table: "multaPlacas",
                column: "PlacasId",
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
                name: "FK_multaPlacas_Multas_MultasId",
                table: "multaPlacas");

            migrationBuilder.DropForeignKey(
                name: "FK_multaPlacas_Placas_PlacasId",
                table: "multaPlacas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_multaPlacas",
                table: "multaPlacas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_infraccionMulta",
                table: "infraccionMulta");

            migrationBuilder.AlterColumn<string>(
                name: "PlacasId",
                table: "multaPlacas",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "MultasId",
                table: "multaPlacas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "idMulta",
                table: "multaPlacas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "idPlaca",
                table: "multaPlacas",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "MultasId",
                table: "infraccionMulta",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CatalogoInfraccionesId",
                table: "infraccionMulta",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "idInfraccion",
                table: "infraccionMulta",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "idMulta",
                table: "infraccionMulta",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_multaPlacas",
                table: "multaPlacas",
                columns: new[] { "idMulta", "idPlaca" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_infraccionMulta",
                table: "infraccionMulta",
                columns: new[] { "idInfraccion", "idMulta" });

            migrationBuilder.CreateIndex(
                name: "IX_multaPlacas_MultasId",
                table: "multaPlacas",
                column: "MultasId");

            migrationBuilder.CreateIndex(
                name: "IX_infraccionMulta_CatalogoInfraccionesId",
                table: "infraccionMulta",
                column: "CatalogoInfraccionesId");

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
    }
}
