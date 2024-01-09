using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class TruckingInvoice
    {
        public long Id { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDateTimeUtc { get; set; }
        public decimal InvoiceAmount { get; set; }
        public string Status { get; set; }
        public decimal GrandTotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime? StatusPaidDateTimeUtc { get; set; }
        // Add other properties as needed
    }
}