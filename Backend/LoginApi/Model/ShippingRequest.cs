using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class ShippingRequest
    {
        [Key]
        public long Id { get; set; }

        public long CustomerCompanyId { get; set; }

        public long ShipperCompanyId { get; set; }
        public string ShippingRequestNumber { get; set; }
        public string ShippingRequestType { get; set; }

        public long? ShippingContainerBookingId { get; set; }

        public long? ShippingROROBookingId { get; set; }
        public DateTime CreatedDateTimeUtc { get; set; }

    }
}