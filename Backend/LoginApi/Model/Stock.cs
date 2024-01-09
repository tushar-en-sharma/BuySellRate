using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class Stock
    {
        [Key]
        public long Id { get; set; }
        public long? ShippingRequestId { get; set; }
        public long CustomerCompanyId { get; set; }
        public string ChassisNumber { get; set; }

        public DateTime CreatedDateTimeUtc { get; set; }
    }

}