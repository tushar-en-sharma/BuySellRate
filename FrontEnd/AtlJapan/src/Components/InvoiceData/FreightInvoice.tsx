import React, { useEffect, useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import * as XLSX from "xlsx";

interface ShippingContainerData {
  bookingNumber: string;
  customerCompanyId: string;
  shippingRequestNumber: string;
  shippingRequestType: string;
  bookingcreatedDateTimeUtc: string;
  grandTotalAmount: string;
  paidAmount: string;
  statusPaidDateTimeUtc: string;
  jobNameEng: string;
  invoiceNumber: string;
  invoiceDate: string;
  status: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function frieghtinvoice() {
  const [data, setData] = useState<ShippingContainerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterETD, setFilterETD] = useState<string | null>(null);
  const [filterCustomerName, setFilterCustomerName] = useState<string>("");
  const [filterBookingNumber, setFilterBookingNumber] = useState<string>("");
  const [filterShippingRequestNumber, setFilterShippingRequestNumber] =
    useState<string>("");
  const [filterInvoice, setFilterInvoice] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/GetFrieghtInvoiceData`);

        const combinedData = [...response.data];
        setData(
          combinedData.sort(
            (a, b) =>
              new Date(b.stockCreatedDateTimeUtc).getTime() -
              new Date(a.stockCreatedDateTimeUtc).getTime()
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  const handleExportToExcel = () => {
    const headers = [
      "Index",
      "Booking Number",
      "Shipping Request Number",
      "Booking Created Date",
      "Total Amount",
      "Paid Amount",
      "Amount Paid Date",
      "Invoice",
      "Invoice Date",
      "Invoice Status",
    ];

    const dataToExport = [
      headers,
      ...filteredData.map((item, index) => [
        index + 1,
        "SBT CO.,LTD",
        item.shippingRequestNumber,
        item.bookingcreatedDateTimeUtc !== "01/01/0001"
          ? new Date(item.bookingcreatedDateTimeUtc)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-")
          : "",
        item.jobNameEng,
        item.invoiceNumber === "NOT FOUND" ? "" : item.invoiceNumber,
        item.invoiceDate === "0001-01-01T00:00:00"
          ? ""
          : new Date(item.invoiceDate)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-"),
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exported_data.xlsx");
  };

  const filteredData = data.filter((item) => {
    return (
      (filterETD
        ? new Date(item.bookingcreatedDateTimeUtc).toLocaleDateString(
            "en-GB"
          ) === new Date(filterETD).toLocaleDateString("en-GB")
        : true) &&
      (filterBookingNumber
        ? item.bookingNumber &&
          item.bookingNumber
            .toLowerCase()
            .includes(filterBookingNumber.toLowerCase())
        : true) &&
      (filterShippingRequestNumber
        ? item.shippingRequestNumber &&
          item.shippingRequestNumber
            .toLowerCase()
            .includes(filterShippingRequestNumber.toLowerCase())
        : true) &&
      (filterInvoice
        ? item.invoiceNumber &&
          item.invoiceNumber.toLowerCase().includes(filterInvoice.toLowerCase())
        : true)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const maxButtonsToShow = 10;

  const renderPageNumbers = () => {
    const middleIndex = Math.floor(maxButtonsToShow / 2);
    let startPage: number, endPage;

    if (totalPages <= maxButtonsToShow) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= middleIndex) {
      startPage = 1;
      endPage = maxButtonsToShow;
    } else if (currentPage + middleIndex >= totalPages) {
      startPage = totalPages - maxButtonsToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - middleIndex;
      endPage = currentPage + middleIndex;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    ).map((number) => (
      <button
        key={number}
        onClick={() => setCurrentPage(number)}
        className={currentPage === number ? "active" : ""}
      >
        {number}
      </button>
    ));
  };

  return (
    <div>
      <div>
        <h3 style={{ paddingLeft: "20px" }}>Filters:-</h3>

        <div style={{ marginLeft: "25px", marginBottom: "10px" }}>
          <table>
            <tr>
              Booking Number:
              <input
                type="text"
                placeholder="Filter by Booking Number"
                style={{
                  width: "175px",
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
                onChange={(e) => setFilterBookingNumber(e.target.value)}
              />
              Shipping Request Number:
              <input
                type="text"
                placeholder="Filter by Shipping Request Number"
                style={{
                  width: "175px",
                  marginLeft: "5px",
                  marginRight: "10px",
                }}
                onChange={(e) => setFilterShippingRequestNumber(e.target.value)}
              />
              Booking Created Date:
              <input
                type="date"
                placeholder="Filter by Booking Created Date"
                style={{
                  width: "175px",
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
                onChange={(e) => setFilterETD(e.target.value)}
              />
              Invoice:
              <input
                type="text"
                placeholder="Filter by Invoice"
                style={{ width: "175px", marginLeft: "5px" }}
                onChange={(e) => setFilterInvoice(e.target.value)}
              />
              <button
                onClick={handleFilterChange}
                style={{ marginLeft: "10px", borderRadius: "5px" }}
              >
                Apply Filter
              </button>
            </tr>
          </table>
        </div>
      </div>

      <div
        style={{ float: "right", marginBottom: "10px", marginRight: "10px" }}
      >
        <label>Show items per page: </label>
        <select
          value={itemsPerPage}
          style={{ fontSize: "small", width: "75px" }}
          onChange={handleItemsPerPageChange}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className="export-button">
        <button style={{ marginLeft: "10px" }} onClick={handleExportToExcel}>
          Export to Excel
        </button>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "20px",
          }}
        >
          <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
        </div>
      ) : (
        <>
          <table className="DashbaordTable">
            <thead>
              <tr>
                <th>Index</th>
                <th>Booking Number</th>
                {/* <th>Customer Company</th> */}
                <th>Shipping Request Number</th>
                <th>Type</th>
                <th>Booking Created Date</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Amount Paid Date</th>
                <th>Invoice</th>
                <th>Invoice Date</th>
                <th>Invoice Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index + 1 + indexOfFirstItem}>
                  <td>{index + 1 + indexOfFirstItem}</td>
                  <td>{item.bookingNumber}</td>
                  {/* <td>SBT CO.,LTD</td> */}
                  <td>{item.shippingRequestNumber}</td>
                  <td>{item.shippingRequestType}</td>
                  <td>
                    {item.bookingcreatedDateTimeUtc !== "01/01/0001" &&
                      new Date(item.bookingcreatedDateTimeUtc)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "-")}
                  </td>
                  <td>{item.grandTotalAmount}</td>
                  <td>{item.paidAmount}</td>
                  <td>
                    {item.statusPaidDateTimeUtc
                      ? item.statusPaidDateTimeUtc !== "01/01/0001"
                        ? new Date(item.statusPaidDateTimeUtc)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(/\//g, "-")
                        : ""
                      : ""}
                  </td>
                  <td>
                    {item.invoiceNumber === "NOT FOUND"
                      ? ""
                      : item.invoiceNumber}
                  </td>
                  <td>
                    {item.invoiceDate === "0001-01-01T00:00:00"
                      ? ""
                      : new Date(item.invoiceDate)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(/\//g, "-")}
                  </td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="pagination">
              {currentPage > 1 ? (
                <button onClick={() => setCurrentPage(currentPage - 1)}>
                  Prev
                </button>
              ) : (
                <button disabled>Prev</button>
              )}
              {renderPageNumbers()}
              {currentPage < totalPages && (
                <button onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </button>
              )}
            </div>

            <div className="currentPage">
              Current Page: {currentPage} of {totalPages}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default frieghtinvoice;
