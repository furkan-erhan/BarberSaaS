using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BarberSaaS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBarberShopToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BarberShopId",
                table: "AspNetUsers",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_BarberShopId",
                table: "AspNetUsers",
                column: "BarberShopId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_BarberShops_BarberShopId",
                table: "AspNetUsers",
                column: "BarberShopId",
                principalTable: "BarberShops",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_BarberShops_BarberShopId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_BarberShopId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "BarberShopId",
                table: "AspNetUsers");
        }
    }
}
