using System.ComponentModel.DataAnnotations;

namespace LoginApi.Model
{
    public class MasterTable
    {

        public string? Ports { get; set; }
        public string? ShippingCompany { get; set; }
        public string? ContainerSize { get; set; }
        public string? ContractSpotType { get; set; }
        [Key]
        public string? Customer { get; set; }
    }
}