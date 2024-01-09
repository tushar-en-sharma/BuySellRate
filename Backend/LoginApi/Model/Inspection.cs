using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class Inspection
    {
        [Key]
        public long Id { get; set; }
        public long StockId { get; set; }
        public string Status { get; set; }

    }


}