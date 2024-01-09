using System.Collections;
using System.Net;
using LoginApi.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace LoginApi.Controllers
{
    public class InvoiceDataController : ControllerBase
    {
        private readonly DataContext _context;
        public InvoiceDataController(DataContext context)
        {
            _context = context;
        }


        // Code for Container Service Invoice
        [HttpGet("GetAllShippingContainerBookingServiceInvoice")]
        public IActionResult GetAllShippingContainerBookingServiceInvoice()
        {
            // Filter entries after 2022 new DateTime(2023, 3, 30) 
            var bookingList = _context.ShippingContainerBooking
     .Where(b => b.ETD.HasValue && b.ETD.Value >= new DateTime(2023, 9, 1))
     .OrderByDescending(b => b.ETD)
     .ToList();


            if (bookingList.Count == 0)
            {
                return NotFound();
            }

            // Extract unique ShipperCompanyIds from the filtered bookingList
            var shipperCompanyIds = bookingList.Select(b => b.ShipperCompanyId).Distinct().ToList();

            // Fetch ShipperCompany entities based on ShipperCompanyIds
            var shipperCompanies = _context.ShipperCompany
                .Where(sc => shipperCompanyIds.Contains(sc.Id))
                .ToDictionary(sc => sc.Id, sc => sc.CompanyNameEng);

            // Fetch ShippingRequest entities
            var shippingRequests = _context.ShippingRequest.ToList();

            // Join ShippingRequest and ShippingContainerBooking on the client side
            var result = bookingList
                .GroupJoin(
                    shippingRequests,
                    scb => scb.Id,
                    sr => sr.ShippingContainerBookingId,
                    (scb, srGroup) => new
                    {
                        BookingNumber = scb.BookingNumber,
                        ShippingContainerBookingId = scb.Id,
                        ETD = scb.ETD,
                        ShipperCompanyId = scb.ShipperCompanyId,
                        ShippingRequestType = srGroup.Select(sr => sr.ShippingRequestType).FirstOrDefault(),
                        CompanyNameEng = shipperCompanies.ContainsKey(scb.ShipperCompanyId) ? shipperCompanies[scb.ShipperCompanyId] : "Unknown",
                        ShippingRequestId = srGroup.Select(sr => sr.Id).FirstOrDefault(),
                    }
                )
                .ToList();

            // Fetch serviceInvoice entities
            var serviceInvoices = _context.serviceInvoice.ToList();

            // Left join with serviceInvoices using GroupJoin
            var enhancedResult = result
     .GroupJoin(
         serviceInvoices,
         r => r.ShippingRequestId,
         si => si.ShippingRequestId,
         (r, siGroup) => new
         {
             r.BookingNumber,
             r.ShippingContainerBookingId,
             CreatedDateTimeUtc = r.ETD, // Replace this line
             r.ETD,
             r.ShipperCompanyId,
             r.CompanyNameEng,
             r.ShippingRequestId,
             r.ShippingRequestType,
             invoicetype = "Service Invoice",
             // Add other properties from serviceInvoice if needed
             InvoiceNumber = siGroup.Select(si => si.InvoiceNumber).FirstOrDefault() ?? "NOT FOUND",
             InvoiceDate = siGroup.Select(si => si.InvoiceDate).FirstOrDefault(),
             Status = siGroup.Select(si => si.Status).FirstOrDefault(),
             GrandTotalAmount = siGroup.Select(si => si.GrandTotalAmount).FirstOrDefault(),
             PaidAmount = siGroup.Select(si => si.PaidAmount).FirstOrDefault(),
             StatusPaidDateTimeUtc = siGroup.Select(si => si.StatusPaidDateTimeUtc).FirstOrDefault(),

         }
     )
     .OrderByDescending(r => r.CreatedDateTimeUtc)
     .ToList();


            return Ok(enhancedResult);
        }

        //Code for Container Freight Invoice
        [HttpGet("GetAllShippingContainerBookingFreightInvoice")]
        public IActionResult GetAllShippingContainerBookingFreightInvoice()
        {
            try
            {
                // Fetch all ShippingContainerBooking entries
                var shippingContainerBookings = _context.ShippingContainerBooking
                    .Where(b => b.ETD.HasValue && b.ETD.Value >= new DateTime(2023, 1, 1))
                    .OrderByDescending(b => b.ETD)
                    .ToList();

                if (shippingContainerBookings.Count == 0)
                {
                    return NotFound("No Shipping Container Bookings found");
                }

                // Extract unique ShippingContainerBookingIds
                var shippingContainerBookingIds = shippingContainerBookings.Select(b => b.Id).ToList();

                // Fetch ShipperCompany entities based on ShipperCompanyIds
                var shipperCompanies = _context.ShipperCompany
                    .Where(sc => shippingContainerBookings.Select(b => b.ShipperCompanyId).Contains(sc.Id))
                    .ToDictionary(sc => sc.Id, sc => sc.CompanyNameEng);

                // Fetch specific properties from ShippingContainerBooking and FreightInvoice
                // Fetch specific properties from ShippingContainerBooking and FreightInvoice
                var result = _context.FreightInvoice
                    .Where(fi => shippingContainerBookingIds.Contains(fi.ShippingContainerBookingId ?? 0))
                    .ToList();


                // Create a list to store the final result
                var finalResult = new List<object>();

                foreach (var fi in result)
                {
                    var booking = shippingContainerBookings.FirstOrDefault(scb => scb.Id == fi.ShippingContainerBookingId);

                    if (booking != null)
                    {
                        finalResult.Add(new
                        {
                            BookingNumber = booking.BookingNumber,
                            ETD = booking.ETD,
                            InvoiceNumber = fi.InvoiceNumber,
                            InvoiceDate = fi.InvoiceDate,
                            Status = fi.Status,
                            GrandTotalAmount = fi.GrandTotalAmount,
                            PaidAmount = fi.PaidAmount,
                            StatusPaidDateTimeUtc = fi.StatusPaidDateTimeUtc,
                            ShippingRequestType = "Container",
                            Invoicetype = "Freight Invoice",
                            CompanyNameEng = shipperCompanies.ContainsKey(booking.ShipperCompanyId)
                                ? shipperCompanies[booking.ShipperCompanyId]
                                : "Unknown"
                        });
                    }
                }

                if (finalResult.Count == 0)
                {
                    return NotFound("No Freight Invoices found for the given Shipping Container Bookings");
                }

                return Ok(finalResult);
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }




        // Code for RORO Service Invoice
        [HttpGet("GetAllShippingROROBookingServiceInvoice")]
        public IActionResult GetAllShippingROROBookingServiceInvoice()
        {
            try
            {
                // Filter entries after 2022
                var bookingList = _context.ShippingROROBooking
                    .Where(b => b.ETD.HasValue && b.ETD.Value >= new DateTime(2023, 1, 1))
                    .OrderByDescending(b => b.ETD)
                    .ToList();

                if (bookingList.Count == 0)
                {
                    return NotFound();
                }

                // Extract unique ShipperCompanyIds from the filtered bookingList
                var shipperCompanyIds = bookingList.Select(b => b.ShipperCompanyId).Distinct().ToList();

                // Fetch ShipperCompany entities based on ShipperCompanyIds
                var shipperCompanies = _context.ShipperCompany
                    .Where(sc => shipperCompanyIds.Contains(sc.Id))
                    .ToDictionary(sc => sc.Id, sc => sc.CompanyNameEng);

                // Fetch ShippingRequest entities
                var shippingRequests = _context.ShippingRequest.ToList();

                // Join ShippingRequest and ShippingContainerBooking on the client side
                var result = bookingList
                    .GroupJoin(
                        shippingRequests,
                        scb => scb.Id,
                        sr => sr.ShippingROROBookingId,
                        (scb, srGroup) => new
                        {
                            BookingNumber = scb.BookingNumber,
                            ShippingContainerBookingId = scb.Id,
                            ETD = scb.ETD,
                            ShipperCompanyId = scb.ShipperCompanyId,
                            ShippingRequestType = srGroup.Select(sr => sr.ShippingRequestType).FirstOrDefault(),
                            CompanyNameEng = shipperCompanies.ContainsKey(scb.ShipperCompanyId) ? shipperCompanies[scb.ShipperCompanyId] : "Unknown",
                            ShippingRequestId = srGroup.Select(sr => sr.Id).FirstOrDefault(),
                        }
                    )
                    .ToList();

                // Fetch serviceInvoice entities
                var serviceInvoices = _context.serviceInvoice.ToList();

                // Left join with serviceInvoices using GroupJoin
                var enhancedResult = result
                    .GroupJoin(
                        serviceInvoices,
                        r => r.ShippingRequestId,
                        si => si.ShippingRequestId,
                        (r, siGroup) => new
                        {
                            r.BookingNumber,
                            r.ShippingContainerBookingId,
                            CreatedDateTimeUtc = r.ETD, // Replace this line
                            r.ETD,
                            r.ShipperCompanyId,
                            r.CompanyNameEng,
                            r.ShippingRequestId,
                            r.ShippingRequestType,
                            invoicetype = "Service Invoice",
                            // Add other properties from serviceInvoice if needed
                            InvoiceNumber = siGroup.Select(si => si.InvoiceNumber).FirstOrDefault() ?? "NOT FOUND",
                            InvoiceDate = siGroup.Select(si => si.InvoiceDate).FirstOrDefault(),
                            Status = siGroup.Select(si => si.Status).FirstOrDefault(),
                            GrandTotalAmount = siGroup.Select(si => si.GrandTotalAmount).FirstOrDefault(),
                            PaidAmount = siGroup.Select(si => si.PaidAmount).FirstOrDefault(),
                            StatusPaidDateTimeUtc = siGroup.Select(si => si.StatusPaidDateTimeUtc).FirstOrDefault(),
                        }
                    )
                    .OrderByDescending(r => r.CreatedDateTimeUtc)
                    .ToList();

                return Ok(enhancedResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        //Code for Container Freight Invoice
        [HttpGet("GetAllShippingROROBookingFreightInvoice")]
        public IActionResult GetAllShippingROROBookingFreightInvoice()
        {
            try
            {
                // Fetch all ShippingContainerBooking entries
                var shippingContainerBookings = _context.ShippingROROBooking
                    .Where(b => b.ETD.HasValue && b.ETD.Value >= new DateTime(2023, 1, 1))
                    .OrderByDescending(b => b.ETD)
                    .ToList();

                if (shippingContainerBookings.Count == 0)
                {
                    return NotFound("No Shipping Container Bookings found");
                }

                // Extract unique ShippingContainerBookingIds
                var shippingContainerBookingIds = shippingContainerBookings.Select(b => b.Id).ToList();

                // Fetch ShipperCompany entities based on ShipperCompanyIds
                var shipperCompanies = _context.ShipperCompany
                    .Where(sc => shippingContainerBookings.Select(b => b.ShipperCompanyId).Contains(sc.Id))
                    .ToDictionary(sc => sc.Id, sc => sc.CompanyNameEng);

                // Fetch specific properties from ShippingContainerBooking and FreightInvoice
                // Fetch specific properties from ShippingContainerBooking and FreightInvoice
                var result = _context.FreightInvoice
                    .Where(fi => shippingContainerBookingIds.Contains(fi.ShippingContainerBookingId.Value))
                    .ToList();


                // Create a list to store the final result
                var finalResult = new List<object>();

                foreach (var fi in result)
                {
                    var booking = shippingContainerBookings.FirstOrDefault(scb => scb.Id == fi.ShippingContainerBookingId);

                    if (booking != null)
                    {
                        finalResult.Add(new
                        {
                            BookingNumber = booking.BookingNumber,
                            ETD = booking.ETD,
                            InvoiceNumber = fi.InvoiceNumber,
                            InvoiceDate = fi.InvoiceDate,
                            GrandTotalAmount = fi.GrandTotalAmount,
                            PaidAmount = fi.PaidAmount,
                            StatusPaidDateTimeUtc = fi.StatusPaidDateTimeUtc,
                            Status = fi.Status,
                            ShippingRequestType = "RORO",
                            Invoicetype = "Freight Invoice",
                            CompanyNameEng = shipperCompanies.ContainsKey(booking.ShipperCompanyId)
                                ? shipperCompanies[booking.ShipperCompanyId]
                                : "Unknown"
                        });
                    }
                }

                if (finalResult.Count == 0)
                {
                    return NotFound("No Freight Invoices found for the given Shipping Container Bookings");
                }

                return Ok(finalResult);
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        public class StockJobDetailsDTO
        {
            public long StockId { get; set; }
            public string? ChassisNumber { get; set; }
            public DateTime StockCreatedDateTimeUtc { get; set; }

            public long StockJobInvoiceId { get; set; }
            public DateTime StockJobInvoiceCreatedDateTimeUtc { get; set; }

            // Properties from StockJobInvoice
            public string? InvoiceNumber { get; set; }
            public DateTime InvoiceDate { get; set; }
            public string? JobNameEng { get; set; }
            public string Status { get; set; }
            public decimal GrandTotalAmount { get; set; }
            public decimal PaidAmount { get; set; }
            public DateTime? StatusPaidDateTimeUtc { get; set; }
        }

        [HttpGet("GetAllStockJobInovice")]
        public IActionResult GetAllStockJobInvoice()
        {
            var stockJobDetails = _context.Stock
                .Where(s => s.CustomerCompanyId == 3 && s.CreatedDateTimeUtc >= new DateTime(2023, 1, 1))
                .OrderByDescending(s => s.CreatedDateTimeUtc)
                .Join(
                    _context.StockJobInvoiceStockJob,
                    stock => stock.ChassisNumber,
                    stockJob => stockJob.ChassisNumber,
                    (stock, stockJob) => new
                    {
                        StockId = stock.Id,
                        stock.ChassisNumber,
                        StockCreatedDateTimeUtc = stock.CreatedDateTimeUtc,
                        StockJobInvoiceId = stockJob.StockJobInvoiceId,
                        StockJobInvoiceCreatedDateTimeUtc = stockJob.CreatedDateTimeUtc,
                        stockJob.JobNameEng
                    })
                .Join(
                    _context.StockJobInvoice,
                    stockJob => stockJob.StockJobInvoiceId,
                    invoice => invoice.Id,
                    (stockJob, invoice) => new StockJobDetailsDTO
                    {
                        StockId = stockJob.StockId,
                        ChassisNumber = stockJob.ChassisNumber,
                        StockCreatedDateTimeUtc = stockJob.StockCreatedDateTimeUtc,
                        StockJobInvoiceId = stockJob.StockJobInvoiceId,
                        StockJobInvoiceCreatedDateTimeUtc = stockJob.StockJobInvoiceCreatedDateTimeUtc,
                        JobNameEng = stockJob.JobNameEng,
                        InvoiceNumber = invoice.InvoiceNumber,
                        InvoiceDate = invoice.InvoiceDate,
                        Status = invoice.Status,
                        GrandTotalAmount = invoice.GrandTotalAmount,
                        PaidAmount = invoice.PaidAmount,
                        StatusPaidDateTimeUtc = invoice.StatusPaidDateTimeUtc
                    })
                .OrderByDescending(result => result.StockCreatedDateTimeUtc)
                .ToList();

            // Filter out records where StatusPaidDateTimeUtc is null
            stockJobDetails = stockJobDetails
                .Where(result => result.StatusPaidDateTimeUtc != null)
                .ToList();

            return Ok(stockJobDetails);
        }

        public class InspectionResult
        {
            public long Id { get; set; }
            public long CustomerCompanyId { get; set; }
            public string InvoiceNumber { get; set; }
            public DateTime InvoiceDate { get; set; }
            public string ChassisNumber { get; set; }
            public DateTime CreatedDateTimeUtc { get; set; }
            public string JobNameEng { get; set; }
            public string inspectionstatus { get; set; }
            public decimal GrandTotalAmount { get; set; }
            public decimal PaidAmount { get; set; }
            public string InvoiceStatus { get; set; }
            public DateTime? StatusPaidDateTimeUtc { get; set; }

        }

        [HttpGet("GetInspectionData")]
        public async Task<ActionResult<IEnumerable<InspectionResult>>> GetInspectionData()
        {
            var result = await _context.Inspection
                .Join(_context.Stock, ins => ins.StockId, stc => stc.Id, (ins, stc) => new { ins, stc })
                .Join(_context.StockJobInvoiceStockJob, j => j.stc.ChassisNumber, sj => sj.ChassisNumber, (j, sj) => new { j, sj })
                .Join(_context.StockJobInvoice, sj => sj.sj.StockJobInvoiceId, sji => sji.Id, (sj, sji) => new InspectionResult
                {
                    Id = sj.j.ins.Id,
                    inspectionstatus = sj.j.ins.Status,
                    InvoiceNumber = sji.InvoiceNumber,
                    CustomerCompanyId = sj.j.stc.CustomerCompanyId,
                    InvoiceDate = sji.InvoiceDate,
                    GrandTotalAmount = sji.GrandTotalAmount,
                    PaidAmount = sji.PaidAmount,
                    StatusPaidDateTimeUtc = sji.StatusPaidDateTimeUtc,
                    InvoiceStatus = sji.Status,
                    ChassisNumber = sj.j.stc.ChassisNumber,
                    CreatedDateTimeUtc = sj.sj.CreatedDateTimeUtc,
                    JobNameEng = sj.sj.JobNameEng
                })
                .Where(r => r.CustomerCompanyId == 3 && r.CreatedDateTimeUtc >= new DateTime(2023, 1, 1))
                .OrderBy(r => r.CreatedDateTimeUtc)
                .ToListAsync();

            return Ok(result);
        }




        [HttpGet("GetFrieghtInvoiceData")]
        public async Task<ActionResult> GetFilteredData()
        {
            try
            {
                // Fetch filtered Freight Invoices
                var filteredFreightInvoices = await _context.FreightInvoice
                    .Where(invoice =>
                        invoice.InvoiceDate > new DateTime(2023, 01, 01))
                    .OrderByDescending(invoice => invoice.InvoiceDate)
                    .ToListAsync();

                // Create a response object with all the data
                var responseData = filteredFreightInvoices.Select(fi =>
                {
                    // Fetch the latest Service Invoice related to Freight Invoice
                    var latestServiceInvoice = _context.serviceInvoice
                        .Where(serviceInvoice => serviceInvoice.Id == fi.ServiceInvoiceId)
                        .OrderByDescending(serviceInvoice => serviceInvoice.Id)
                        .FirstOrDefault();

                    // Fetch the latest Shipping Request related to the latest Service Invoice
                    var latestShippingRequest = latestServiceInvoice != null
                        ? _context.ShippingRequest
                            .FirstOrDefault(shippingRequest => shippingRequest.Id == latestServiceInvoice.ShippingRequestId)
                        : null;

                    // Additional logic to determine the booking based on shippingRequestType
                    dynamic booking = null;

                    if (latestShippingRequest != null)
                    {
                        if (latestShippingRequest.ShippingRequestType == "Container")
                        {
                            booking = _context.ShippingContainerBooking
                                .FirstOrDefault(b => b.Id == latestShippingRequest.ShippingContainerBookingId);
                        }
                        else
                        {
                            booking = _context.ShippingROROBooking
                                .FirstOrDefault(b => b.Id == latestShippingRequest.ShippingROROBookingId);
                        }
                    }

                    return new
                    {
                        fi.Id,
                        fi.Status,
                        fi.GrandTotalAmount,
                        fi.PaidAmount,
                        fi.StatusPaidDateTimeUtc,
                        fi.CustomerCompanyId,
                        fi.ServiceInvoiceId,
                        fi.InvoiceNumber,
                        fi.InvoiceDate,
                        fi.ShippingContainerBookingId,
                        fi.ShippingROROBookingId,
                        shippingRequestNumber = latestShippingRequest?.ShippingRequestNumber,
                        shippingRequestType = latestShippingRequest?.ShippingRequestType,
                        bookingid = booking?.Id,
                        bookingshipperCompanyId = booking?.ShipperCompanyId,
                        bookingNumber = booking?.BookingNumber,
                        bookingcreatedDateTimeUtc = booking?.CreatedDateTimeUtc,
                        bookingetd = booking?.ETD
                    };
                });

                return Ok(responseData);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return StatusCode(500, "Internal Server Error");
            }
        }


        [HttpGet("GetTruckingData")]
        public async Task<IActionResult> GetTruckingData()
        {
            var result = await _context.TruckingSheet
                .Join(
                    _context.TruckingInvoiceStock,
                    ts => ts.Id,
                    tis => tis.TruckingSheetId,
                    (ts, tis) => new { ts, tis }
                )
                .Join(
                    _context.TruckingInvoice,
                    combined => combined.tis.TruckingInvoiceId,
                    ti => ti.Id,
                    (combined, ti) => new
                    {
                        Status = ti.Status,
                        InvoiceAmount = ti.InvoiceAmount,
                        GrandTotalAmount = ti.GrandTotalAmount,
                        PaidAmount = ti.PaidAmount,
                        StatusPaidDateTimeUtc = ti.StatusPaidDateTimeUtc,
                        InvoiceNumber = ti.InvoiceNumber,
                        InvoiceDateTimeUtc = ti.InvoiceDateTimeUtc,
                        ChassisNumber = combined.tis.ChassisNumber,
                        TruckingSheetNumber = combined.tis.TruckingSheetNumber,
                        CreatedDateTimeUtc = combined.tis.CreatedDateTimeUtc,
                    }
                )
                .Where(data => data.CreatedDateTimeUtc >= new DateTime(2023, 1, 1)) // Filter based on CreatedDateTimeUtc
                .OrderByDescending(data => data.CreatedDateTimeUtc) // Order in descending based on CreatedDateTimeUtc
                .ToListAsync();

            // Check for null values in the result
            var nonNullResult = result
                .Where(data =>
                    data.Status != null &&
                    data.InvoiceAmount != null &&
                    data.GrandTotalAmount != null &&
                    data.PaidAmount != null &&
                    data.StatusPaidDateTimeUtc != null &&
                    data.InvoiceNumber != null &&
                    data.InvoiceDateTimeUtc != null &&
                    data.ChassisNumber != null &&
                    data.TruckingSheetNumber != null &&
                    data.CreatedDateTimeUtc != null
                )
                .ToList();

            return Ok(result);
        }






    }
}