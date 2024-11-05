using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RelacionesDeDisputas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_disputas_idJuez",
                table: "disputas",
                column: "idJuez");

            migrationBuilder.CreateIndex(
                name: "IX_disputas_idMulta",
                table: "disputas",
                column: "idMulta");

            migrationBuilder.CreateIndex(
                name: "IX_disputas_idOficial",
                table: "disputas",
                column: "idOficial");

            migrationBuilder.CreateIndex(
                name: "IX_disputas_idUsuarioFinal",
                table: "disputas",
                column: "idUsuarioFinal");

            migrationBuilder.AddForeignKey(
                name: "FK_disputas_Multas_idMulta",
                table: "disputas",
                column: "idMulta",
                principalTable: "Multas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_disputas_Usuarios_idJuez",
                table: "disputas",
                column: "idJuez",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_disputas_Usuarios_idOficial",
                table: "disputas",
                column: "idOficial",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_disputas_Usuarios_idUsuarioFinal",
                table: "disputas",
                column: "idUsuarioFinal",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_disputas_Multas_idMulta",
                table: "disputas");

            migrationBuilder.DropForeignKey(
                name: "FK_disputas_Usuarios_idJuez",
                table: "disputas");

            migrationBuilder.DropForeignKey(
                name: "FK_disputas_Usuarios_idOficial",
                table: "disputas");

            migrationBuilder.DropForeignKey(
                name: "FK_disputas_Usuarios_idUsuarioFinal",
                table: "disputas");

            migrationBuilder.DropIndex(
                name: "IX_disputas_idJuez",
                table: "disputas");

            migrationBuilder.DropIndex(
                name: "IX_disputas_idMulta",
                table: "disputas");

            migrationBuilder.DropIndex(
                name: "IX_disputas_idOficial",
                table: "disputas");

            migrationBuilder.DropIndex(
                name: "IX_disputas_idUsuarioFinal",
                table: "disputas");
        }
    }
}
