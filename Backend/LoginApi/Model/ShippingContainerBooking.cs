using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class ShippingContainerBooking
    {
        [Key]
        public long Id { get; set; }
        public long ShipperCompanyId { get; set; }
        public string? BookingNumber { get; set; }
        public DateTime? CreatedDateTimeUtc { get; set; }
        public DateTime? ETD { get; set; }
    }
}