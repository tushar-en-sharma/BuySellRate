using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;


namespace LoginApi.Model
{
    public class FreightInvoice
    {
        [Key]
        public long Id { get; set; }


        public long? CustomerCompanyId { get; set; }

        public long? ServiceInvoiceId { get; set; }
        public string? InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }

        public long? ShippingContainerBookingId { get; set; }
        public long? ShippingROROBookingId { get; set; }
        public string Status { get; set; }
        public decimal GrandTotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime? StatusPaidDateTimeUtc { get; set; }

    }
}