using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class ShipperCompany
    {
        [Key]
        public long Id { get; set; }

        public long CustomerCompanyId { get; set; }

        public string CompanyNameEng { get; set; }
    }
}