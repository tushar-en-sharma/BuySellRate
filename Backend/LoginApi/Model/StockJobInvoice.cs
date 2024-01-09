using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class StockJobInvoice
    {
        [Key]
        public long Id { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal GrandTotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime? StatusPaidDateTimeUtc { get; set; }
        public string Status { get; set; }
    }

}