using Microsoft.EntityFrameworkCore;

namespace LoginApi.Model
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<AddBuySellRate> BuySellRate { get; set; }

        public DbSet<MasterTable> MasterTable { get; set; }

        public DbSet<SellRate> SellRate { get; set; }
        public DbSet<ShipperCompany> ShipperCompany { get; set; }
        public DbSet<ShippingContainerBooking> ShippingContainerBooking { get; set; }
        public DbSet<ShippingROROBooking> ShippingROROBooking { get; set; }
        public DbSet<serviceInvoice> serviceInvoice { get; set; }
        public DbSet<ShippingRequest> ShippingRequest { get; set; }
        public DbSet<FreightInvoice> FreightInvoice { get; set; }
        public DbSet<Stock> Stock { get; set; }
        public DbSet<StockJobInvoiceStockJob> StockJobInvoiceStockJob { get; set; }

        public DbSet<StockJobInvoice> StockJobInvoice { get; set; }
        public DbSet<Inspection> Inspection { get; set; }

        public DbSet<TruckingSheet> TruckingSheet { get; set; }
        public DbSet<TruckingInvoiceStock> TruckingInvoiceStock { get; set; }
        public DbSet<TruckingInvoice> TruckingInvoice { get; set; }
    }
}