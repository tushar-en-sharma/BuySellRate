import React, { useEffect, useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import * as XLSX from "xlsx";

interface ShippingContainerData {
  bookingNumber: string;
  etd: string;
  invoiceNumber: string;
  invoiceDate: string;
  shippingRequestType: string;
  invoicetype: string;
  companyNameEng: string;
  grandTotalAmount: string;
  paidAmount: string;
  statusPaidDateTimeUtc: string;
  status: string;
}

interface TableSort {
  column: keyof ShippingContainerData | null;
  direction: "asc" | "desc";
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const tableHeaders = [
  { key: "bookingNumber", label: "Booking ID" },
  { key: "companyNameEng", label: "Customer Name" },
  { key: "shippingRequestType", label: "Type" },
  { key: "etd", label: "ETD" },
  { key: "grandTotalAmount", label: "Total Amount" },
  { key: "paidAmount", label: "Paid Amount" },
  { key: "statusPaidDateTimeUtc", label: "Paid Date" },
  { key: "invoicetype", label: "Invoice Type" },
  { key: "invoiceNumber", label: "Invoice" },
  { key: "invoiceDate", label: "Invoice Date" },
  { key: "status", label: "Status" },
  // Add other headers as needed
];

function ShipmentContainerPage() {
  const [data, setData] = useState<ShippingContainerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterCompanyName, setFilterCompanyName] = useState<string | null>(
    null
  );
  const [filterBookingId, setFilterBookingId] = useState<string | null>(null);
  const [filterETD, setFilterETD] = useState<string | null>(null);
  const [filterInvoice, setFilterInvoice] = useState<string | null>(null);
  const [filterInvoiceType, setFilterInvoiceType] = useState<string | null>(
    null
  );
  const [filterCriteriaChanged, setFilterCriteriaChanged] = useState(false);

  const [sort, setSort] = useState<TableSort>({
    column: null,
    direction: "asc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(
          `${BASE_URL}/GetAllShippingContainerBookingServiceInvoice`
        );
        const response2 = await axios.get(
          `${BASE_URL}/GetAllShippingContainerBookingFreightInvoice`
        );

        const combinedData = [...response1.data, ...response2.data];
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

  const handleSort = (column: keyof ShippingContainerData) => {
    setSort((prevSort) => ({
      column,
      direction:
        prevSort.column === column && prevSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const filteredData = data
    .filter((item) =>
      filterCompanyName
        ? item.companyNameEng
            .toLowerCase()
            .includes(filterCompanyName.toLowerCase())
        : true
    )
    .filter((item) =>
      filterBookingId
        ? (item.bookingNumber || "")
            .toLowerCase()
            .includes((filterBookingId || "").toLowerCase())
        : true
    )
    .filter((item) =>
      filterETD
        ? new Date(item.etd).toLocaleDateString("en-GB") ===
          new Date(filterETD).toLocaleDateString("en-GB")
        : true
    )
    .filter((item) =>
      filterInvoice
        ? item.invoiceNumber.toLowerCase().includes(filterInvoice.toLowerCase())
        : true
    )
    .filter((item) =>
      filterInvoiceType
        ? item.invoicetype
            .toLowerCase()
            .includes(filterInvoiceType.toLowerCase())
        : true
    );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sort.column) {
      const aValue = a[sort.column];
      const bValue = b[sort.column];

      if (aValue !== null && bValue !== null) {
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sort.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          const aDate = aValue as Date;
          const bDate = bValue as Date;

          return sort.direction === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }
      }
    }

    return 0;
  });

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
      "Booking ID",
      "Customer Name",
      "Type",
      "ETD",
      "Total Amount",
      "Paid Amount",
      "Paid Date",
      "Invoice Type",
      "Invoice",
      "Invoice Date",
      "Invoice Status",
    ];

    const dataToExport = [
      headers,
      ...sortedData.map((item, index) => [
        index + 1 + indexOfFirstItem,
        item.bookingNumber,
        item.companyNameEng,
        item.shippingRequestType,
        item.etd !== "01/01/0001"
          ? new Date(item.etd)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-")
          : "",
        item.invoicetype,
        item.grandTotalAmount,
        item.paidAmount,
        item.statusPaidDateTimeUtc !== "01/01/0001"
          ? new Date(item.statusPaidDateTimeUtc)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-")
          : "",
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
        item.status,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exported_data.xlsx");
  };

  const renderTableHeaders = () => {
    return tableHeaders.map((header) => (
      <th key={header.key} onClick={() => handleSort(header.key)}>
        {header.label}{" "}
        {sort.column === header.key && (sort.direction === "asc" ? "▲" : "▼")}
      </th>
    ));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3 style={{ paddingLeft: "20px" }}>Filters:-</h3>
        <div
          className="filter-controls"
          style={{ paddingLeft: "20px", paddingRight: "90px" }}
        >
          <input
            type="text"
            placeholder="Filter by Booking ID"
            style={{ width: "175px", marginRight: "20px" }}
            onChange={(e) => setFilterBookingId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Customer Name"
            style={{ width: "175px", marginRight: "20px" }}
            onChange={(e) => setFilterCompanyName(e.target.value)}
          />
          ETD :
          <input
            type="date"
            placeholder="Filter by ETD"
            style={{ width: "175px", marginRight: "20px" }}
            onChange={(e) => setFilterETD(e.target.value)}
          />
          <select
            style={{ width: "175px", marginRight: "5px" }}
            onChange={(e) => setFilterInvoiceType(e.target.value)}
          >
            <option value="">Filter by Invoice Type</option>
            <option value="Service Invoice">Service Invoice</option>
            <option value="Freight Invoice">Freight Invoice</option>
            {/* Add other invoice type options as needed */}
          </select>
          <input
            type="text"
            placeholder="Filter by Invoice"
            style={{ width: "175px", marginRight: "20px" }}
            onChange={(e) => setFilterInvoice(e.target.value)}
          />
          <button
            onClick={handleFilterChange}
            style={{ marginLeft: "10px", borderRadius: "5px" }}
          >
            Apply Filter
          </button>
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
        <div style={{ paddingLeft: "10px" }} className="export-container">
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
                  {renderTableHeaders()}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index + 1 + indexOfFirstItem}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    {tableHeaders.map((header) => (
                      <td key={header.key}>
                        {header.key === "etd" ||
                        header.key === "invoiceDate" ||
                        header.key === "statusPaidDateTimeUtc"
                          ? item[header.key] !== "01/01/0001"
                            ? header.key === "statusPaidDateTimeUtc" &&
                              new Date(item[header.key]).getTime() === 0
                              ? ""
                              : new Date(item[header.key])
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .replace(/\//g, "-")
                            : ""
                          : item[header.key]}
                      </td>
                    ))}
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
              <div style={{ alignContent: "center" }} className="pagination">
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

export default ShipmentContainerPage;
