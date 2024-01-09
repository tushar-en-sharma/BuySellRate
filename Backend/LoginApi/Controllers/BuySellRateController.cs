using System.Collections;
using System.Net;
using LoginApi.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

[Route("api/[controller]")]
[ApiController]
public class BuySellRateController : ControllerBase
{
    private readonly DataContext _context;
    public BuySellRateController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Add(AddBuySellRate values)
    {
        if (values == null || !ModelState.IsValid) return BadRequest();
        _context.BuySellRate.Add(values);
        await _context.SaveChangesAsync();
        return Ok("Values Successfully Added");
    }

    [HttpGet("GetBuySellRate")]
    public IActionResult GetBuySellRate(int Status, string pol, string pod, string ShippingCompany, string ContainerSize, string ContractSpotType, DateTime ValidityFrom, DateTime ValidityTo)
    {
        var product = _context.BuySellRate.FirstOrDefault(p => (p.Status == 0 && p.POL == pol && p.ValidityFrom == ValidityFrom && p.ValidityTo == ValidityTo && p.POD == pod && p.ContainerSize == ContainerSize && p.ShippingCompany == ShippingCompany) && p.ContractSpotType == ContractSpotType);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpGet("FindBuySellRate")]
    public IActionResult GetFindBuySellRate(int Status, string pol = null, string pod = null, string ContainerSize = null)
    {
        var query = _context.BuySellRate.AsQueryable();

        // Check if the parameter is not null or empty before applying the condition
        if (Status != 1)
        {
            query = query.Where(p => p.Status == 0);
        }
        if (!string.IsNullOrEmpty(pol))
        {
            query = query.Where(p => p.POL == pol);
        }

        if (!string.IsNullOrEmpty(pod))
        {
            query = query.Where(p => p.POD == pod);
        }

        if (!string.IsNullOrEmpty(ContainerSize))
        {
            query = query.Where(p => p.ContainerSize == ContainerSize);
        }

        var products = query.ToList();

        if (products.Count == 0)
        {
            return NotFound();
        }

        return Ok(products);
    }

    // [HttpGet("FindBuySellRate")]
    // public IActionResult GetFindBuySellRate(string pol, string pod, string ContainerSize)
    // {
    //     var products = _context.BuySellRate.Where(p => p.POL == pol || p.POD == pod || p.ContainerSize == ContainerSize).ToList();

    //     if (products.Count == 0)
    //     {
    //         return NotFound();
    //     }

    //     return Ok(products);

    // }

    [HttpGet("GetBuyRate")]
    public IActionResult GetBuyRate(string pol, string pod, DateTime ValidityFrom, DateTime ValidityTo)
    {
        var products = _context.BuySellRate
            .Where(p => p.POL == pol && p.POD == pod && p.ValidityFrom == ValidityFrom && p.ValidityTo == ValidityTo && p.Status == 0)
            .ToList();

        if (products == null || products.Count == 0)
        {
            return NotFound();
        }

        // You can customize the message as needed
        string responseMessage = "Response found";

        // You can create an anonymous object to return both products and the custom message
        var result = new
        {
            Products = products,
            Message = responseMessage
        };

        return Ok(result);
    }


    [HttpGet("{id}")]
    public IActionResult GetBuySellRatebyID(int id)
    {
        var product = _context.BuySellRate.FirstOrDefault(p => p.ID == id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpGet("GetAllBuySellRate")]
    public IActionResult GetAllBuySellRate()
    {
        var products = _context.BuySellRate.Where(p => p.Status == 0).ToList();

        if (products.Count == 0)
        {
            return NotFound();
        }

        return Ok(products);
    }

    // public IActionResult GetAllBuySellRate()
    // {
    //     var products = _context.BuySellRate.ToList();

    //     if (products.Count == 0)
    //     {
    //         return NotFound();
    //     }

    //     return Ok(products);
    // }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var entity = _context.BuySellRate.Find(id);

        if (entity == null)
        {
            return NotFound(); // Return 404 if the entity is not found
        }

        _context.BuySellRate.Remove(entity);
        _context.SaveChanges();

        return NoContent(); // Return 204 No Content if the entity is successfully deleted
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBuySellRate(int id, [FromBody] AddBuySellRate updateDto)
    {
        // Retrieve the existing record from the database
        var existingRate = await _context.BuySellRate.FindAsync(id);

        if (existingRate == null)
        {
            return NotFound(); // Or handle the case where the record is not found
        }

        // Update the existing record with the new values
        existingRate.POR = updateDto.POR;
        existingRate.POL = updateDto.POL;
        existingRate.POD = updateDto.POD;
        existingRate.FinalPlaceDelivery = updateDto.FinalPlaceDelivery;
        existingRate.ShippingCompany = updateDto.ShippingCompany;
        existingRate.ContainerSize = updateDto.ContainerSize;
        existingRate.ContractSpotType = updateDto.ContractSpotType;
        existingRate.ValidityTo = updateDto.ValidityTo;
        existingRate.ValidityFrom = updateDto.ValidityFrom;
        existingRate.BuyoceanfreightUSD = updateDto.BuyoceanfreightUSD;
        existingRate.BuyoceanfreightJPY = updateDto.BuyoceanfreightJPY;
        existingRate.BuySurrChargeUSD = updateDto.BuySurrChargeUSD;
        existingRate.BuySurrChargeJPY = updateDto.BuySurrChargeJPY;
        existingRate.BuyTHCOriginUSD = updateDto.BuyTHCOriginUSD;
        existingRate.BuyTHCOriginJPY = updateDto.BuyTHCOriginJPY;
        existingRate.BuySealUSD = updateDto.BuySealUSD;
        existingRate.BuySealJPY = updateDto.BuySealJPY;
        existingRate.BuyDocFeeUSD = updateDto.BuyDocFeeUSD;
        existingRate.BuyDocFeeJPY = updateDto.BuyDocFeeJPY;
        existingRate.BuyOtherUSD = updateDto.BuyOtherUSD;
        existingRate.BuyOtherJPY = updateDto.BuyOtherJPY;
        existingRate.BuyTotalUSD = updateDto.BuyTotalUSD;
        existingRate.BuyTotalJPY = updateDto.BuyTotalJPY;
        existingRate.SelloceanfreightUSD = updateDto.SelloceanfreightUSD;
        existingRate.SelloceanfreightJPY = updateDto.SelloceanfreightJPY;
        existingRate.SellSurrChargeUSD = updateDto.SellSurrChargeUSD;
        existingRate.SellSurrChargeJPY = updateDto.SellSurrChargeJPY;
        existingRate.SellTHCOriginUSD = updateDto.SellTHCOriginUSD;
        existingRate.SellTHCOriginJPY = updateDto.SellTHCOriginJPY;
        existingRate.SellSealUSD = updateDto.SellSealUSD;
        existingRate.SellSealJPY = updateDto.SellSealJPY;
        existingRate.SellDocFeeUSD = updateDto.SellDocFeeUSD;
        existingRate.SellDocFeeJPY = updateDto.SellDocFeeJPY;
        existingRate.SellOtherUSD = updateDto.SellOtherUSD;
        existingRate.SellOtherJPY = updateDto.SellOtherJPY;
        existingRate.SellTotalUSD = updateDto.SellTotalUSD;
        existingRate.SellTotalJPY = updateDto.SellTotalJPY;
        existingRate.USDRate = updateDto.USDRate;
        existingRate.JPYRate = updateDto.JPYRate;
        // ... Update other properties

        // Save changes to the database
        await _context.SaveChangesAsync();

        return NoContent(); // Or return an appropriate response
    }


    [HttpPatch("status/{id}")]
    public async Task<IActionResult> Updatestatus(int id, [FromBody] AddBuySellRate updateDto)
    {
        // Retrieve the existing record from the database
        var existingRate = await _context.BuySellRate.FindAsync(id);

        if (existingRate == null)
        {
            return NotFound(); // Or handle the case where the record is not found
        }

        // Update the existing record with the new values
        existingRate.Status = updateDto.Status;
        // ... Update other properties

        // Save changes to the database
        await _context.SaveChangesAsync();

        return Ok("Success"); // Or return an appropriate response
    }
}

[Route("api/[controller]")]
[ApiController]
public class SellRateController : ControllerBase
{

    private readonly DataContext _context;
    public SellRateController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddSellRate(SellRate values)
    {
        // Generate and set the QuotationNumber
        values.QuotationNumber = GenerateQuotationNumber();

        // Add the values to the context
        _context.SellRate.Add(values);

        // Save changes to the database
        await _context.SaveChangesAsync();

        return Ok("Values Successfully Added");
    }

    private string GenerateQuotationNumber()
    {
        int currentYear = DateTime.Now.Year;

        // Get the last used quotation number from the database
        var lastUsedNumber = _context.SellRate
            .Where(s => s.QuotationNumber.StartsWith($"ATLENQ{currentYear}-"))
            .Select(s => s.QuotationNumber)
            .AsEnumerable()  // Materialize the results locally
            .Select(quotationNumber => int.TryParse(quotationNumber.Substring($"ATLENQ{currentYear}-".Length), out int number) ? number : 0)
            .DefaultIfEmpty(0)
            .Max();

        // Increment the last used number
        lastUsedNumber++;

        // Generate the new quotation number
        string quotationNumber = $"ATLENQ{currentYear}-{lastUsedNumber.ToString().PadLeft(5, '0')}";

        return quotationNumber;
    }


    [HttpGet("{id}")]
    public IActionResult GetSellRatebyID(int id)
    {
        var product = _context.SellRate.FirstOrDefault(p => p.ID == id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }



    [HttpGet("GetAllSellRate")]
    public IActionResult GetAllSellRate()
    {
        // var products = _context.SellRate.ToList();
        var products = _context.SellRate.Where(p => p.status == 0).ToList();

        if (products.Count == 0)
        {
            return NotFound();
        }

        return Ok(products);
    }

    [HttpGet("GetSellRate")]
    public IActionResult GetSellRate(string pol = null, string pod = null, string CustomerName = null, string ShippingCompany = null, string ContainerSize = null, string ContractSpotType = null, DateTime? ValidityFrom = null, DateTime? ValidityTo = null)
    {
        var query = _context.SellRate.AsQueryable();

        // Add a filter for Status equal to 0
        query = query.Where(p => p.status == 0);

        if (!string.IsNullOrEmpty(pol))
        {
            query = query.Where(p => p.POL == pol);
        }

        if (!string.IsNullOrEmpty(pod))
        {
            query = query.Where(p => p.POD == pod);
        }

        if (!string.IsNullOrEmpty(CustomerName))
        {
            query = query.Where(p => p.Customer == CustomerName);
        }

        if (!string.IsNullOrEmpty(ShippingCompany))
        {
            query = query.Where(p => p.ShippingCompany == ShippingCompany);
        }

        if (!string.IsNullOrEmpty(ContainerSize))
        {
            query = query.Where(p => p.ContainerSize == ContainerSize);
        }

        if (!string.IsNullOrEmpty(ContractSpotType))
        {
            query = query.Where(p => p.ContractSpotType == ContractSpotType);
        }

        if (ValidityFrom != null)
        {
            query = query.Where(p => p.ValidityFrom == ValidityFrom);
        }

        if (ValidityTo != null)
        {
            query = query.Where(p => p.ValidityTo == ValidityTo);
        }

        var products = query.ToList();

        if (products == null || products.Count == 0)
        {
            return NotFound();
        }

        // You can customize the message as needed
        string responseMessage = "Response found";

        // You can create an anonymous object to return both products and the custom message
        var result = new
        {
            Products = products,
            Message = responseMessage
        };

        return Ok(result);
    }



    // [HttpGet("GetSellRate")]
    // public IActionResult GetSellRate(string pol, string pod, string CustomerName, string ShippingCompany, string ContainerSize, string ContractSpotType, DateTime ValidityFrom, DateTime ValidityTo)
    // {
    //     var products = _context.SellRate
    //         .Where(p => p.POL == pol || p.POD == pod || p.Customer == CustomerName || p.ShippingCompany == ShippingCompany || p.ContainerSize == ContainerSize || p.ContractSpotType == ContractSpotType || p.ValidityFrom == ValidityFrom || p.ValidityTo == ValidityTo)
    //         .ToList();

    //     if (products == null || products.Count == 0)
    //     {
    //         return NotFound();
    //     }

    //     // You can customize the message as needed
    //     string responseMessage = "Response found";

    //     // You can create an anonymous object to return both products and the custom message
    //     var result = new
    //     {
    //         Products = products,
    //         Message = responseMessage
    //     };

    //     return Ok(result);
    // }

    [HttpDelete("{id}")]
    public IActionResult DeleteSell(int id)
    {
        var entity = _context.SellRate.Find(id);

        if (entity == null)
        {
            return NotFound(); // Return 404 if the entity is not found
        }

        _context.SellRate.Remove(entity);
        _context.SaveChanges();

        return NoContent(); // Return 204 No Content if the entity is successfully deleted
    }

    [HttpPatch("status/{id}")]
    public async Task<IActionResult> UpdateSellstatus(int id, [FromBody] SellRate updateDto)
    {
        // Retrieve the existing record from the database
        var existingRate = await _context.SellRate.FindAsync(id);

        if (existingRate == null)
        {
            return NotFound(); // Or handle the case where the record is not found
        }

        // Update the existing record with the new values
        existingRate.status = updateDto.status;
        // ... Update other properties

        // Save changes to the database
        await _context.SaveChangesAsync();

        return Ok("Success"); // Or return an appropriate response
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSellRate(int id, [FromBody] SellRate updateDto)
    {
        // Retrieve the existing record from the database
        var existingRate = await _context.SellRate.FindAsync(id);

        if (existingRate == null)
        {
            return NotFound(); // Or handle the case where the record is not found
        }

        // Update the existing record with the new values
        existingRate.POR = updateDto.POR;
        existingRate.POL = updateDto.POL;
        existingRate.POD = updateDto.POD;
        existingRate.Customer = updateDto.Customer;
        existingRate.FinalPlaceDelivery = updateDto.FinalPlaceDelivery;
        existingRate.ShippingCompany = updateDto.ShippingCompany;
        existingRate.ContainerSize = updateDto.ContainerSize;
        existingRate.ContractSpotType = updateDto.ContractSpotType;
        existingRate.ValidityTo = updateDto.ValidityTo;
        existingRate.ValidityFrom = updateDto.ValidityFrom;
        existingRate.BuyoceanfreightUSD = updateDto.BuyoceanfreightUSD;
        existingRate.BuyoceanfreightJPY = updateDto.BuyoceanfreightJPY;
        existingRate.BuySurrChargeUSD = updateDto.BuySurrChargeUSD;
        existingRate.BuySurrChargeJPY = updateDto.BuySurrChargeJPY;
        existingRate.BuyTHCOriginUSD = updateDto.BuyTHCOriginUSD;
        existingRate.BuyTHCOriginJPY = updateDto.BuyTHCOriginJPY;
        existingRate.BuySealUSD = updateDto.BuySealUSD;
        existingRate.BuySealJPY = updateDto.BuySealJPY;
        existingRate.BuyDocFeeUSD = updateDto.BuyDocFeeUSD;
        existingRate.BuyDocFeeJPY = updateDto.BuyDocFeeJPY;
        existingRate.BuyOtherUSD = updateDto.BuyOtherUSD;
        existingRate.BuyOtherJPY = updateDto.BuyOtherJPY;
        existingRate.BuyTotalUSD = updateDto.BuyTotalUSD;
        existingRate.BuyTotalJPY = updateDto.BuyTotalJPY;
        existingRate.SelloceanfreightUSD = updateDto.SelloceanfreightUSD;
        existingRate.SelloceanfreightJPY = updateDto.SelloceanfreightJPY;
        existingRate.SellSurrChargeUSD = updateDto.SellSurrChargeUSD;
        existingRate.SellSurrChargeJPY = updateDto.SellSurrChargeJPY;
        existingRate.SellTHCOriginUSD = updateDto.SellTHCOriginUSD;
        existingRate.SellTHCOriginJPY = updateDto.SellTHCOriginJPY;
        existingRate.SellSealUSD = updateDto.SellSealUSD;
        existingRate.SellSealJPY = updateDto.SellSealJPY;
        existingRate.SellDocFeeUSD = updateDto.SellDocFeeUSD;
        existingRate.SellDocFeeJPY = updateDto.SellDocFeeJPY;
        existingRate.SellOtherUSD = updateDto.SellOtherUSD;
        existingRate.SellOtherJPY = updateDto.SellOtherJPY;
        existingRate.SellTotalUSD = updateDto.SellTotalUSD;
        existingRate.SellTotalJPY = updateDto.SellTotalJPY;
        existingRate.USDRate = updateDto.USDRate;
        existingRate.JPYRate = updateDto.JPYRate;
        // ... Update other properties

        // Save changes to the database
        await _context.SaveChangesAsync();

        return NoContent(); // Or return an appropriate response
    }

}


[Route("api/[controller]")]
[ApiController]
public class MasterTableController : ControllerBase
{

    private readonly DataContext _context;
    public MasterTableController(DataContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddMasterTable(MasterTable values)
    {
        _context.MasterTable.Add(values);
        await _context.SaveChangesAsync();
        return Ok("Values Successfully Added");
    }

    [HttpGet]
    public IEnumerable<Dictionary<string, string>> Get()
    {
        // Assuming '_context' is a DbContext instance with a DbSet for 'MasterTable'
        var data = _context.MasterTable.ToList();

        // Create a list to hold the result
        var resultList = new List<Dictionary<string, string>>();

        // Iterate through the 'MasterTable' entities and convert them to dictionaries
        foreach (var entity in data)
        {
            var myDict = new Dictionary<string, string>();

            // Replace 'Property1' and 'Property2' with the actual property names you want to include
            myDict.Add("port", entity.Ports);
            myDict.Add("ContainerSize", entity.ContainerSize);
            myDict.Add("ShippingCompany", entity.ShippingCompany);
            myDict.Add("ContractSpotType", entity.ContractSpotType);
            myDict.Add("CustomerName", entity.Customer);


            // Add the dictionary to the result list
            resultList.Add(myDict);
        }

        // Return the list of dictionaries
        return resultList;
    }

}