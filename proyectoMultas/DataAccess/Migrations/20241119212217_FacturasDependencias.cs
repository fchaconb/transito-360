using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FacturasDependencias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Facturas_IdMulta",
                table: "Facturas",
                column: "IdMulta");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_IdUsuario",
                table: "Facturas",
                column: "IdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Multas_IdMulta",
                table: "Facturas",
                column: "IdMulta",
                principalTable: "Multas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Usuarios_IdUsuario",
                table: "Facturas",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Multas_IdMulta",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Usuarios_IdUsuario",
                table: "Facturas");

            migrationBuilder.DropIndex(
                name: "IX_Facturas_IdMulta",
                table: "Facturas");

            migrationBuilder.DropIndex(
                name: "IX_Facturas_IdUsuario",
                table: "Facturas");
        }
    }
}
