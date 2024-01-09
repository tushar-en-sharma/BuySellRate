using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class StockJobInvoiceStockJob
    {
        [Key]
        public long Id { get; set; }
        public long StockJobInvoiceId { get; set; }
        public string ChassisNumber { get; set; }

        public DateTime CreatedDateTimeUtc { get; set; }
        public string JobNameEng { get; set; }
        public string StockJobInvoice { get; set; }
    }

}