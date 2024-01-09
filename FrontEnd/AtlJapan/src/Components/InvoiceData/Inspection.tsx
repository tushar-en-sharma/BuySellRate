import React, { useEffect, useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import * as XLSX from "xlsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ShippingContainerData {
  id: string;
  customerCompanyId: string;
  invoiceNumber: string;
  invoiceDate: string;
  chassisNumber: string;
  createdDateTimeUtc: string;
  grandTotalAmount: string;
  paidAmount: string;
  statusPaidDateTimeUtc: string;
  jobNameEng: string;
  invoiceStatus: string;
}

const Inspection = () => {
  const [data, setData] = useState<ShippingContainerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterETD, setFilterETD] = useState<string | null>(null);
  const [filterChassisNumber, setFilterChassisNumber] = useState<string>("");
  const [filterStockJobName, setFilterStockJobName] = useState<string>("");
  const [filterInvoice, setFilterInvoice] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/GetInspectionData`);

        const combinedData = [...response.data];
        setData(
          combinedData.sort(
            (a, b) =>
              new Date(b.createdDateTimeUtc).getTime() -
              new Date(a.createdDateTimeUtc).getTime()
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
      "Chassis Number",
      "Stock Created Date",
      "Stock Job Type",
      "Total Amount",
      "Paid Amount",
      "Paid Date",
      "Invoice",
      "Invoice Date",
      "Invoice Status",
    ];

    const dataToExport = [
      headers,
      ...filteredData.map((item, index) => [
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
        item.jobNameEng,
        item.grandTotalAmount,
        item.paidAmount,
        item.statusPaidDateTimeUtc !== "0001-01-01T00:00:00"
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
        item.invoiceStatus,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exported_data.xlsx");
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const filteredData = data.filter((item) => {
    return (
      (filterETD
        ? new Date(item.createdDateTimeUtc).toLocaleDateString("en-GB") ===
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
  const currentItems = sortedData().slice(indexOfFirstItem, indexOfLastItem);

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
      <div className="filter-container">
        <div>
          <label>ETD Filter:</label>
          <input
            type="date"
            value={filterETD || ""}
            onChange={(e) => setFilterETD(e.target.value)}
            onBlur={handleFilterChange}
          />
        </div>
        <div>
          <label>Chassis Number Filter:</label>
          <input
            type="text"
            value={filterChassisNumber}
            onChange={(e) => setFilterChassisNumber(e.target.value)}
            onBlur={handleFilterChange}
          />
        </div>
        <div>
          <label>Stock Job Type Filter:</label>
          <input
            type="text"
            value={filterStockJobName}
            onChange={(e) => setFilterStockJobName(e.target.value)}
            onBlur={handleFilterChange}
          />
        </div>
        <div>
          <label>Invoice Filter:</label>
          <input
            type="text"
            value={filterInvoice}
            onChange={(e) => setFilterInvoice(e.target.value)}
            onBlur={handleFilterChange}
          />
        </div>
      </div>
      <div style={{ float: "right" }}>
        Items per page:
        <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div>
        <button onClick={handleExportToExcel}>Export to Excel</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Index</th>
            <SortableHeader
              label="Chassis Number"
              sortKey="chassisNumber"
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <SortableHeader
              label="Stock Created Date"
              sortKey="createdDateTimeUtc"
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <SortableHeader
              label="Stock Job Type"
              sortKey="jobNameEng"
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <SortableHeader
              label="Total Amount"
              sortKey="grandTotalAmount"
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <SortableHeader
              label="Paid Amount"
              sortKey="paidAmount"
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <SortableHeader
              label="Paid Date"
              sortKey="statusPaidDateTimeUtc"
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <SortableHeader
              label="Invoice"
              sortKey="invoiceNumber"
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <SortableHeader
              label="Invoice Date"
              sortKey="invoiceDate"
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <SortableHeader
              label="Invoice Status"
              sortKey="invoiceStatus"
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9}>
                <ClipLoader loading={true} size={50} />
              </td>
            </tr>
          ) : (
            currentItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.chassisNumber}</td>
                <td>
                  {item.createdDateTimeUtc !== "01/01/0001"
                    ? new Date(item.createdDateTimeUtc)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "-")
                    : ""}
                </td>
                <td>{item.jobNameEng}</td>
                <td>{item.grandTotalAmount}</td>
                <td>{item.paidAmount}</td>
                <td>
                  {item.statusPaidDateTimeUtc !== "0001-01-01T00:00:00"
                    ? new Date(item.statusPaidDateTimeUtc)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "-")
                    : ""}
                </td>
                <td>
                  {item.invoiceNumber === "NOT FOUND" ? "" : item.invoiceNumber}
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
                <td>{item.invoiceStatus}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", alignItems: "stretch" }}>
        <button
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage > 1 ? prevPage - 1 : prevPage
            )
          }
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage < totalPages ? prevPage + 1 : prevPage
            )
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: string } | null;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  sortKey,
  onSort,
  sortConfig,
}) => {
  const handleClick = () => {
    onSort(sortKey);
  };

  return (
    <th
      onClick={handleClick}
      className={sortConfig?.key === sortKey ? sortConfig.direction : ""}
    >
      {label}
    </th>
  );
};

export default Inspection;
