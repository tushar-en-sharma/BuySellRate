using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class TruckingInvoiceStock
    {
        public int Id { get; set; }
        public int TruckingSheetId { get; set; }
        public int TruckingInvoiceId { get; set; }
        public string ChassisNumber { get; set; }
        public string TruckingSheetNumber { get; set; }
        public DateTime CreatedDateTimeUtc { get; set; }

        // Add other properties as needed
    }

}