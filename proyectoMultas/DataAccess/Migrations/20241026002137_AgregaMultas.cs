using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AgregaMultas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Multas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombreInfractor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    apellidoInfractor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    cedulaInfractor = table.Column<int>(type: "int", nullable: false),
                    longitud = table.Column<float>(type: "real", nullable: false),
                    latitud = table.Column<float>(type: "real", nullable: false),
                    fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    pagada = table.Column<string>(type: "nvarchar(1)", nullable: false),
                    fotoSinpe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    total = table.Column<double>(type: "float", nullable: false),
                    IdOficial = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Multas", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Multas");
        }
    }
}
