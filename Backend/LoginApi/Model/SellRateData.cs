using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LoginApi.Model
{
    public class SellRate
    {
        [Key]
        public int ID { get; set; }
        public string? POR { get; set; }
        public string? POL { get; set; }
        public string? POD { get; set; }
        public string? FinalPlaceDelivery { get; set; }
        public string? Customer { get; set; }
        public string? ShippingCompany { get; set; }
        public string? ContainerSize { get; set; }
        public string? ContractSpotType { get; set; }
        public DateTime ValidityFrom { get; set; }
        public DateTime ValidityTo { get; set; }
        public string? USDRate { get; set; }
        public string? JPYRate { get; set; }
        public string? BuyoceanfreightUSD { get; set; }
        public string? BuyoceanfreightJPY { get; set; }
        public string? BuySurrChargeUSD { get; set; }
        public string? BuySurrChargeJPY { get; set; }
        public string? BuyTHCOriginUSD { get; set; }
        public string? BuyTHCOriginJPY { get; set; }
        public string? BuySealUSD { get; set; }
        public string? BuySealJPY { get; set; }
        public string? BuyDocFeeUSD { get; set; }
        public string? BuyDocFeeJPY { get; set; }
        public string? BuyOtherUSD { get; set; }
        public string? BuyOtherJPY { get; set; }
        public string? BuyTotalUSD { get; set; }
        public string? BuyTotalJPY { get; set; }
        public string? SelloceanfreightUSD { get; set; }
        public string? SelloceanfreightJPY { get; set; }
        public string? SellSurrChargeUSD { get; set; }
        public string? SellSurrChargeJPY { get; set; }
        public string? SellTHCOriginUSD { get; set; }
        public string? SellTHCOriginJPY { get; set; }
        public string? SellSealUSD { get; set; }
        public string? SellSealJPY { get; set; }
        public string? SellDocFeeUSD { get; set; }
        public string? SellDocFeeJPY { get; set; }
        public string? SellOtherUSD { get; set; }
        public string? SellOtherJPY { get; set; }
        public string? SellTotalUSD { get; set; }
        public string? SellTotalJPY { get; set; }

        public string? CreatedBy { get; set; }
        public int status { get; set; }
        public string? QuotationNumber { get; set; }
    }
}