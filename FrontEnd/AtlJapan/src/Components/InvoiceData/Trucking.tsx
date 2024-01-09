import React, { useEffect, useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import * as XLSX from "xlsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ShippingContainerData {
  status: string;
  invoiceAmount: string;
  grandTotalAmount: string;
  paidAmount: string;
  statusPaidDateTimeUtc: string;
  invoiceNumber: string;
  invoiceDateTimeUtc: string;
  chassisNumber: string;
  truckingSheetNumber: string;
  createdDateTimeUtc: string;
}

function truckinginvoice() {
  const [data, setData] = useState<ShippingContainerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterCompanyName, setFilterCompanyName] = useState<string | null>(
    null
  );
  const [filterBookingId, setFilterBookingId] = useState<string | null>(null);
  const [filterETD, setFilterETD] = useState<string | null>(null);
  const [filterInvoice, setFilterInvoice] = useState<string | null>(null);
  const [filterInvoiceStatus, setFilterInvoiceStatus] = useState<string | null>(
    null
  );
  const [filterInvoiceType, setFilterInvoiceType] = useState<string | null>(
    null
  );
  const [filterCriteriaChanged, setFilterCriteriaChanged] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterInvoiceAmount, setFilterInvoiceAmount] = useState<string | null>(
    null
  );
  const [filterGrandTotalAmount, setFilterGrandTotalAmount] = useState<
    string | null
  >(null);
  const [filterPaidAmount, setFilterPaidAmount] = useState<string | null>(null);

  const [filteredData, setFilteredData] = useState<ShippingContainerData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(`${BASE_URL}/GetTruckingData`);
        const combinedData = [...response1.data];
        setData(
          combinedData.sort(
            (a, b) => new Date(b.etd).getTime() - new Date(a.etd).getTime()
          )
        );
        setFilterCriteriaChanged(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterCriteriaChanged]);

  useEffect(() => {
    const filteredData = data
      .filter((item) =>
        filterCompanyName
          ? item.chassisNumber
              .toLowerCase()
              .includes(filterCompanyName.toLowerCase())
          : true
      )
      .filter((item) =>
        filterBookingId
          ? (item.truckingSheetNumber || "")
              .toLowerCase()
              .includes((filterBookingId || "").toLowerCase())
          : true
      )
      .filter((item) =>
        filterETD
          ? new Date(item.createdDateTimeUtc).toLocaleDateString("en-GB") ===
            new Date(filterETD).toLocaleDateString("en-GB")
          : true
      )
      .filter((item) =>
        filterInvoice
          ? item.invoiceNumber.toLowerCase().includes(filterInvoice.toLowerCase())
          : true
      )
      .filter((item) =>
        filterInvoiceStatus
          ? item.status.toLowerCase().includes(filterInvoiceStatus.toLowerCase())
          : true
      )
      .filter((item) =>
        filterInvoiceType
          ? new Date(item.invoiceDateTimeUtc).toLocaleDateString("en-GB") ===
            new Date(filterInvoiceType).toLocaleDateString("en-GB")
          : true
      );

    setFilteredData(filteredData);
  }, [data, filterCompanyName, filterBookingId, filterETD, filterInvoice, filterInvoiceStatus, filterInvoiceType]);

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn as keyof ShippingContainerData];
        const bValue = b[sortColumn as keyof ShippingContainerData];

        if (sortOrder === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      })
    : filteredData;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
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

  const handleFilterChange = () => {
    setFilterCriteriaChanged(true);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleExportToExcel = () => {
    const headers = [
      "Index",
      "Trucking Sheet Number",
      "Chassis Number",
      "Trucking Invoice Stock Create Date",
      "Grand Total Amount",
      "Status Paid Date",
      "Payment Amount",
      "Invoice Number",
      "Invoice Date",
      "Invoice Amount",
      "Invoice Status",
    ];

    const dataToExport = [
      headers,
      ...sortedData.map((item, index) => [
        index + 1 + indexOfFirstItem,
        item.truckingSheetNumber,
        item.chassisNumber,
        item.createdDateTimeUtc !== "01/01/0001"
          ? new Date(item.createdDateTimeUtc)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-")
          : "",
        item.grandTotalAmount,
        item.statusPaidDateTimeUtc
          ? new Date(item.statusPaidDateTimeUtc)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-")
          : "NULL", // Display "NULL" if statusPaidDateTimeUtc is null or "0001-01-01T00:00:00"
        item.paidAmount,
        item.invoiceNumber === "NOT FOUND" ? "" : item.invoiceNumber,
        item.invoiceDateTimeUtc !== "0001-01-01T00:00:00"
          ? new Date(item.invoiceDateTimeUtc)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-")
          : "",
        item.invoiceAmount,
        item.status,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exported_data.xlsx");
  };

  return (
    <>
      <div>
        <h3 style={{ paddingLeft: "10px" }}>Filters:-</h3>
        <div
          className="filter-controls"
          style={{
            paddingLeft: "20px",
            paddingRight: "90px",
            paddingBottom: "10px",
          }}
        >
          <table>
            <tr>
              Trucking Sheet Number:-
              <input
                type="text"
                placeholder="Filter by Trucking Sheet Number"
                style={{
                  width: "175px",
       

  return (
    <>
      <div>
        <h3 style={{ paddingLeft: "10px" }}>Filters:-</h3>
        <div
          className="filter-controls"
          style={{
            paddingLeft: "20px",
            paddingRight: "90px",
            paddingBottom: "10px",
          }}
        >
          <table>
            <tr>
              Trucking Sheet Number:-
              <input
                type="text"
                placeholder="Filter by Trucking Sheet Number"
                style={{
                  width: "175px",
                  marginRight: "20px",
                  marginLeft: "5px",
                }}
                onChange={(e) => setFilterBookingId(e.target.value)}
              />
              Chassis Number :-
              <input
                type="text"
                placeholder="Filter by Chassis Number"
                style={{
                  width: "175px",
                  marginRight: "20px",
                  marginLeft: "5px",
                }}
                onChange={(e) => setFilterCompanyName(e.target.value)}
              />
              Trucking Invoice Stock Create Date :
              <input
                type="date"
                placeholder="Filter by Trucking Invoice Stock Create Date"
                style={{
                  width: "175px",
                  marginRight: "20px",
                  marginLeft: "5px",
                }}
                onChange={(e) => setFilterETD(e.target.value)}
              />
            </tr>
            <tr>
              Invoice:-
              <input
                type="text"
                placeholder="Filter by Invoice"
                style={{
                  width: "175px",
                  marginRight: "105px",
                  marginLeft: "5px",
                }}
                onChange={(e) => setFilterInvoice(e.target.value)}
              />
              Invoice Date:-
              <input
                type="date"
                placeholder="Filter by Invoice Date"
                style={{
                  width: "175px",
                  marginRight: "50px",
                  marginLeft: "5px",
                }}
                onChange={(e) => setFilterInvoiceType(e.target.value)}
              />
              Invoice Status:-
              <input
                type="text"
                placeholder="Filter by Invoice Status"
                style={{
                  width: "175px",
                  marginRight: "5px",
                  marginLeft: "5px",
                }}
                onChange={(e) => setFilterInvoiceStatus(e.target.value)}
              />
            </tr>
            <tr>
              <button
                onClick={handleFilterChange}
                style={{
                  marginLeft: "500px",
                  borderRadius: "5px",
                  marginTop: "20px",
                }}
              >
                Apply Filter
              </button>
            </tr>
          </table>
        </div>
      </div>
      <div>
        <div
          style={{
            float: "right",
            marginBottom: "10px",
            marginRight: "5px",
            marginLeft: "5px",
          }}
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
        <div style={{ paddingLeft: "10px" }} className="export-button">
          <button onClick={handleExportToExcel}>Export to Excel</button>
        </div>
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
                  <th onClick={() => handleSort("truckingSheetNumber")}>
                    Trucking Sheet Number
                  </th>
                  <th onClick={() => handleSort("chassisNumber")}>
                    Chassis Number
                  </th>
                  <th onClick={() => handleSort("createdDateTimeUtc")}>
                    Trucking Invoice Stock Create Date
                  </th>
                  <th onClick={() => handleSort("grandTotalAmount")}>
                    Grand Total Amount
                  </th>
                  <th onClick={() => handleSort("statusPaidDateTimeUtc")}>
                    Status Paid Date
                  </th>
                  <th onClick={() => handleSort("paidAmount")}>
                    Payment Amount
                  </th>
                  <th onClick={() => handleSort("invoiceNumber")}>
                    Invoice Number
                  </th>
                  <th onClick={() => handleSort("invoiceDateTimeUtc")}>
                    Invoice Date
                  </th>
                  <th onClick={() => handleSort("invoiceAmount")}>
                    Invoice Amount
                  </th>
                  <th onClick={() => handleSort("status")}>Invoice Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index + 1 + indexOfFirstItem}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td>{item.truckingSheetNumber}</td>
                    <td>{item.chassisNumber}</td>
                    <td>
                      {item.createdDateTimeUtc !== "01/01/0001" &&
                        new Date(item.createdDateTimeUtc)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(/\//g, "-")}
                    </td>
                    <td>{item.grandTotalAmount}</td>
                    <td>
                      {item.statusPaidDateTimeUtc
                        ? new Date(item.statusPaidDateTimeUtc)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(/\//g, "-")
                        : ""}
                    </td>
                    <td>{item.paidAmount}</td>
                    <td>
                      {item.invoiceNumber === "NOT FOUND"
                        ? ""
                        : item.invoiceNumber}
                    </td>
                    <td>
                      {item.invoiceDateTimeUtc === "0001-01-01T00:00:00"
                        ? ""
                        : new Date(item.invoiceDateTimeUtc)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(/\//g, "-")}
                    </td>
                    <td>{item.invoiceAmount}</td>
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
    </>
  );
}

export default truckinginvoice;
