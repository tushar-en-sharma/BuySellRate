import React, { useEffect, useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import * as XLSX from "xlsx";
import "./StockJob.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ShippingContainerData {
  chassisNumber: string;
  stockCreatedDateTimeUtc: string;
  jobNameEng: string;
  invoiceDate: string;
  invoiceNumber: string;
  statusPaidDateTimeUtc: string;
  paidAmount: string;
  grandTotalAmount: string;
  status: string;
}

function StockJobType() {
  const [data, setData] = useState<ShippingContainerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterETD, setFilterETD] = useState<string | null>(null);
  const [filterCustomerName, setFilterCustomerName] = useState<string>("");
  const [filterChassisNumber, setFilterChassisNumber] = useState<string>("");
  const [filterStockJobName, setFilterStockJobName] = useState<string>("");
  const [filterInvoice, setFilterInvoice] = useState<string>("");
  const [sort, setSort] = useState<{
    column: keyof ShippingContainerData | null;
    direction: "asc" | "desc";
  }>({
    column: null,
    direction: "asc",
  });

  // Function to get sorted data
  // Function to get sorted data
  const sortedData = (
    dataToSort: ShippingContainerData[],
    sort: {
      column: keyof ShippingContainerData | null;
      direction: "asc" | "desc";
    }
  ) => {
    if (sort.column !== null) {
      return dataToSort.sort((a, b) => {
        const valueA = a[sort.column];
        const valueB = b[sort.column];

        if (sort.direction === "asc") {
          return compareValues(valueA, valueB);
        } else {
          return compareValues(valueB, valueA);
        }
      });
    }

    return dataToSort;
  };

  // Function to compare values for sorting
  const compareValues = (valueA: any, valueB: any) => {
    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB, undefined, { numeric: true });
    } else if (typeof valueA === "number" && typeof valueB === "number") {
      return valueA - valueB;
    } else if (valueA instanceof Date && valueB instanceof Date) {
      return valueA.getTime() - valueB.getTime();
    }

    // Handle other data types as needed
    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/GetAllStockJobInovice`);

        const combinedData = [...response.data];
        setData(sortedData(combinedData, sort));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [sort]);

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
      "Customer Name",
      "Chassis Number",
      "Stock Created Date",
      "Stock Job Name",
      "Total Amount",
      "Paid Amount",
      "Paid Date",
      "Invoice",
      "Invoice Date",
      "Invoice Status",
    ];

    const dataToExport = [
      headers,
      ...data.map((item, index) => [
        index + 1,
        "SBT CO.,LTD",
        item.chassisNumber,
        item.stockCreatedDateTimeUtc !== "01/01/0001"
          ? new Date(item.stockCreatedDateTimeUtc)
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

  const handleSort = (column: keyof ShippingContainerData) => {
    setSort((prevSort) => ({
      column,
      direction:
        prevSort.column === column && prevSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const filteredData = data.filter((item) => {
    return (
      (filterETD
        ? new Date(item.stockCreatedDateTimeUtc).toLocaleDateString("en-GB") ===
          new Date(filterETD).toLocaleDateString("en-GB")
        : true) &&
      (filterChassisNumber
        ? item.chassisNumber
            .toLowerCase()
            .includes(filterChassisNumber.toLowerCase())
        : true) &&
      (filterStockJobName
        ? item.jobNameEng
            .toLowerCase()
            .includes(filterStockJobName.toLowerCase())
        : true) &&
      (filterInvoice
        ? item.invoiceNumber.toLowerCase().includes(filterInvoice.toLowerCase())
        : true)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData(filteredData, sort).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
    <div className="container">
      <div className="table-container">
        <div className="filter-container">
          <label>
            Filter by ETD:
            <input
              type="date"
              value={filterETD || ""}
              onChange={(e) => setFilterETD(e.target.value)}
              onBlur={handleFilterChange}
            />
          </label>
          {/* <label>
            Filter by Customer Name:
            <input
              type="text"
              value={filterCustomerName}
              onChange={(e) => setFilterCustomerName(e.target.value)}
              onBlur={handleFilterChange}
            />
          </label> */}
          <label>
            Filter by Chassis Number:
            <input
              type="text"
              value={filterChassisNumber}
              onChange={(e) => setFilterChassisNumber(e.target.value)}
              onBlur={handleFilterChange}
            />
          </label>
          <label>
            Filter by Stock Job Name:
            <input
              type="text"
              value={filterStockJobName}
              onChange={(e) => setFilterStockJobName(e.target.value)}
              onBlur={handleFilterChange}
            />
          </label>
          <label>
            Filter by Invoice:
            <input
              type="text"
              value={filterInvoice}
              onChange={(e) => setFilterInvoice(e.target.value)}
              onBlur={handleFilterChange}
            />
          </label>
        </div>
        <label style={{ float: "right" }}>
          Items per page:
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e)}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
        <div className="export-container">
          <button onClick={handleExportToExcel}>Export to Excel</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th onClick={() => handleSort("chassisNumber")}>
                Chassis Number{" "}
                {sort.column === "chassisNumber" && (
                  <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("stockCreatedDateTimeUtc")}>
                Stock Created Date{" "}
                {sort.column === "stockCreatedDateTimeUtc" && (
                  <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("jobNameEng")}>
                Stock Job Name{" "}
                {sort.column === "jobNameEng" && (
                  <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("invoiceNumber")}>
                Invoice{" "}
                {sort.column === "invoiceNumber" && (
                  <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("invoiceDate")}>
                Invoice Date{" "}
                {sort.column === "invoiceDate" && (
                  <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("grandTotalAmount")}>
                Total Amount{" "}
                {sort.column === "grandTotalAmount" && (
                  <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("paidAmount")}>
                Paid Amount{" "}
                {sort.column === "paidAmount" && (
                  <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("statusPaidDateTimeUtc")}>
                Paid Date{" "}
                {sort.column === "statusPaidDateTimeUtc" && (
                  <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("status")}>
                Invoice Status{" "}
                {sort.column === "status" && (
                  <span>{sort.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="loading-container">
                  <ClipLoader color="#36D7B7" loading={loading} size={35} />
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="no-data-container">
                  No data available.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.chassisNumber}</td>
                  <td>
                    {new Date(item.stockCreatedDateTimeUtc).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td>{item.jobNameEng}</td>
                  <td>{item.invoiceNumber}</td>
                  <td>
                    {item.invoiceDate !== "0001-01-01T00:00:00"
                      ? new Date(item.invoiceDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </td>
                  <td>{item.grandTotalAmount}</td>
                  <td>{item.paidAmount}</td>
                  <td>
                    {item.statusPaidDateTimeUtc !== "01/01/0001"
                      ? new Date(item.statusPaidDateTimeUtc).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : ""}
                  </td>
                  <td>{item.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{ display: "flex", alignItems: "stretch" }}
        className="pagination-container"
      >
        <div className="page-numbers">
          <button
            onClick={() =>
              setCurrentPage((prevPage) =>
                prevPage > 1 ? prevPage - 1 : prevPage
              )
            }
          >
            Prev
          </button>
          {renderPageNumbers()}
          <button
            onClick={() =>
              setCurrentPage((prevPage) =>
                prevPage < totalPages ? prevPage + 1 : prevPage
              )
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockJobType;
