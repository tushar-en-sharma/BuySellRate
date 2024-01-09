using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LoginApi.Migrations
{
    /// <inheritdoc />
    public partial class initialcreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BuySellRate",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    POR = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    POL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    POD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FinalPlaceDelivery = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShippingCompany = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContainerSize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContractSpotType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValidityFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ValidityTo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    USDRate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JPYRate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyoceanfreightUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyoceanfreightJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuySurrChargeUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuySurrChargeJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyTHCOriginUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyTHCOriginJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuySealUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuySealJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyDocFeeUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyDocFeeJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyOtherUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyOtherJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyTotalUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyTotalJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SelloceanfreightUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SelloceanfreightJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellSurrChargeUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellSurrChargeJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellTHCOriginUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellTHCOriginJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellSealUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellSealJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellDocFeeUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellDocFeeJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellOtherUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellOtherJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellTotalUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellTotalJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuySellRate", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "MasterTable",
                columns: table => new
                {
                    Customer = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Ports = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShippingCompany = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContainerSize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContractSpotType = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterTable", x => x.Customer);
                });

            migrationBuilder.CreateTable(
                name: "SellRate",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    POR = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    POL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    POD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FinalPlaceDelivery = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Customer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShippingCompany = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContainerSize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContractSpotType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValidityFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ValidityTo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    USDRate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JPYRate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyoceanfreightUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyoceanfreightJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuySurrChargeUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuySurrChargeJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyTHCOriginUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyTHCOriginJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuySealUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuySealJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyDocFeeUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyDocFeeJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyOtherUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyOtherJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyTotalUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyTotalJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SelloceanfreightUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SelloceanfreightJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellSurrChargeUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellSurrChargeJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellTHCOriginUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellTHCOriginJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellSealUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellSealJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellDocFeeUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellDocFeeJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellOtherUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellOtherJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellTotalUSD = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SellTotalJPY = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SellRate", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BuySellRate");

            migrationBuilder.DropTable(
                name: "MasterTable");

            migrationBuilder.DropTable(
                name: "SellRate");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
