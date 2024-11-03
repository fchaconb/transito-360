using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AgregaDisputa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "idUsuarioFinal",
                table: "disputas",
                newName: "IdUsuarioFinal");

            migrationBuilder.RenameColumn(
                name: "idOficial",
                table: "disputas",
                newName: "IdOficial");

            migrationBuilder.RenameColumn(
                name: "idJuez",
                table: "disputas",
                newName: "IdJuez");

            migrationBuilder.AlterColumn<byte[]>(
                name: "fotoPerfil",
                table: "Usuarios",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0],
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contrasena",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DisputaId",
                table: "Multas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FacturasId",
                table: "Multas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlacasId",
                table: "Multas",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "disputas",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notificacions_IdUsuario",
                table: "Notificacions",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Multas_DisputaId",
                table: "Multas",
                column: "DisputaId");

            migrationBuilder.CreateIndex(
                name: "IX_Multas_FacturasId",
                table: "Multas",
                column: "FacturasId");

            migrationBuilder.CreateIndex(
                name: "IX_Multas_PlacasId",
                table: "Multas",
                column: "PlacasId");

            migrationBuilder.CreateIndex(
                name: "IX_infraccionMulta_idInfraccion",
                table: "infraccionMulta",
                column: "idInfraccion");

            migrationBuilder.CreateIndex(
                name: "IX_infraccionMulta_idMulta_idInfraccion",
                table: "infraccionMulta",
                columns: new[] { "idMulta", "idInfraccion" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_IdMulta",
                table: "Facturas",
                column: "IdMulta");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_IdUsuario",
                table: "Facturas",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_disputas_IdJuez",
                table: "disputas",
                column: "IdJuez");

            migrationBuilder.CreateIndex(
                name: "IX_disputas_idMulta",
                table: "disputas",
                column: "idMulta");

            migrationBuilder.CreateIndex(
                name: "IX_disputas_IdOficial",
                table: "disputas",
                column: "IdOficial");

            migrationBuilder.CreateIndex(
                name: "IX_disputas_IdUsuarioFinal",
                table: "disputas",
                column: "IdUsuarioFinal");

            migrationBuilder.CreateIndex(
                name: "IX_disputas_UsuarioId",
                table: "disputas",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_disputas_Multas_idMulta",
                table: "disputas",
                column: "idMulta",
                principalTable: "Multas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_disputas_Usuarios_IdJuez",
                table: "disputas",
                column: "IdJuez",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_disputas_Usuarios_IdOficial",
                table: "disputas",
                column: "IdOficial",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_disputas_Usuarios_IdUsuarioFinal",
                table: "disputas",
                column: "IdUsuarioFinal",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_disputas_Usuarios_UsuarioId",
                table: "disputas",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Multas_IdMulta",
                table: "Facturas",
                column: "IdMulta",
                principalTable: "Multas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Usuarios_IdUsuario",
                table: "Facturas",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_infraccionMulta_CatalogoInfracciones_idInfraccion",
                table: "infraccionMulta",
                column: "idInfraccion",
                principalTable: "CatalogoInfracciones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_infraccionMulta_Multas_idMulta",
                table: "infraccionMulta",
                column: "idMulta",
                principalTable: "Multas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Multas_Facturas_FacturasId",
                table: "Multas",
                column: "FacturasId",
                principalTable: "Facturas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Multas_Placas_PlacasId",
                table: "Multas",
                column: "PlacasId",
                principalTable: "Placas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Multas_disputas_DisputaId",
                table: "Multas",
                column: "DisputaId",
                principalTable: "disputas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notificacions_Usuarios_IdUsuario",
                table: "Notificacions",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_disputas_Multas_idMulta",
                table: "disputas");

            migrationBuilder.DropForeignKey(
                name: "FK_disputas_Usuarios_IdJuez",
                table: "disputas");

            migrationBuilder.DropForeignKey(
                name: "FK_disputas_Usuarios_IdOficial",
                table: "disputas");

            migrationBuilder.DropForeignKey(
                name: "FK_disputas_Usuarios_IdUsuarioFinal",
                table: "disputas");

            migrationBuilder.DropForeignKey(
                name: "FK_disputas_Usuarios_UsuarioId",
                table: "disputas");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Multas_IdMulta",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Usuarios_IdUsuario",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_infraccionMulta_CatalogoInfracciones_idInfraccion",
                table: "infraccionMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_infraccionMulta_Multas_idMulta",
                table: "infraccionMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_Multas_Facturas_FacturasId",
                table: "Multas");

            migrationBuilder.DropForeignKey(
                name: "FK_Multas_Placas_PlacasId",
                table: "Multas");

            migrationBuilder.DropForeignKey(
                name: "FK_Multas_disputas_DisputaId",
                table: "Multas");

            migrationBuilder.DropForeignKey(
                name: "FK_Notificacions_Usuarios_IdUsuario",
                table: "Notificacions");

            migrationBuilder.DropIndex(
                name: "IX_Notificacions_IdUsuario",
                table: "Notificacions");

            migrationBuilder.DropIndex(
                name: "IX_Multas_DisputaId",
                table: "Multas");

            migrationBuilder.DropIndex(
                name: "IX_Multas_FacturasId",
                table: "Multas");

            migrationBuilder.DropIndex(
                name: "IX_Multas_PlacasId",
                table: "Multas");

            migrationBuilder.DropIndex(
                name: "IX_infraccionMulta_idInfraccion",
                table: "infraccionMulta");

            migrationBuilder.DropIndex(
                name: "IX_infraccionMulta_idMulta_idInfraccion",
                table: "infraccionMulta");

            migrationBuilder.DropIndex(
                name: "IX_Facturas_IdMulta",
                table: "Facturas");

            migrationBuilder.DropIndex(
                name: "IX_Facturas_IdUsuario",
                table: "Facturas");

            migrationBuilder.DropIndex(
                name: "IX_disputas_IdJuez",
                table: "disputas");

            migrationBuilder.DropIndex(
                name: "IX_disputas_idMulta",
                table: "disputas");

            migrationBuilder.DropIndex(
                name: "IX_disputas_IdOficial",
                table: "disputas");

            migrationBuilder.DropIndex(
                name: "IX_disputas_IdUsuarioFinal",
                table: "disputas");

            migrationBuilder.DropIndex(
                name: "IX_disputas_UsuarioId",
                table: "disputas");

            migrationBuilder.DropColumn(
                name: "Contrasena",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "DisputaId",
                table: "Multas");

            migrationBuilder.DropColumn(
                name: "FacturasId",
                table: "Multas");

            migrationBuilder.DropColumn(
                name: "PlacasId",
                table: "Multas");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "disputas");

            migrationBuilder.RenameColumn(
                name: "IdUsuarioFinal",
                table: "disputas",
                newName: "idUsuarioFinal");

            migrationBuilder.RenameColumn(
                name: "IdOficial",
                table: "disputas",
                newName: "idOficial");

            migrationBuilder.RenameColumn(
                name: "IdJuez",
                table: "disputas",
                newName: "idJuez");

            migrationBuilder.AlterColumn<byte[]>(
                name: "fotoPerfil",
                table: "Usuarios",
                type: "varbinary(max)",
                nullable: true,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)");
        }
    }
}
