import { useEffect, useState } from "react";
import NavbarDashboard from "../Navbar/NavbarDashboard";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles, createTheme } from "@material-ui/core/styles";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { confirmAlert } from "react-confirm-alert"; // Import the library
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the styles
import Modal from "@mui/material/Modal";

const theme = createTheme();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useStyles = makeStyles((theme) => ({
  button: {
    border: "2px solid #2196f3", // Blue border
    borderRadius: "8px", // Rounded corners
    padding: "10px 20px", // Padding
    margin: "10px", // Margin
    textTransform: "none", // Avoid uppercase text
    fontSize: "16px", // Font size
    "&:hover": {
      backgroundColor: "#2196f3", // Hover background color
      color: "#fff", // Hover text color
      border: "2px solid #2196f3", // Set to the same color as the default border
    },
  },

  deleteButton: {
    width: "auto",
    height: "auto",
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "6px 12px", // Adjusted padding for a smaller size
    fontSize: "14px", // Adjusted font size for a smaller size
    "&:hover": {
      backgroundColor: "#d32f2f",
    },
  },
}));

type DataItem = {
  id(id: any): void;
  status(status: any): void;
  por: string;
  pol: string;
  pod: string;
  finalPlaceDelivery: string;
  shippingCompany: string;
  containerSize: string;
  contractSpotType: string;
  validityFrom: string;
  validityTo: string;
  usdRate: string;
  jpyRate: string;
  buyoceanfreightUSD: string;
  buyoceanfreightJPY: string;
  buySurrChargeUSD: string;
  buySurrChargeJPY: string;
  buyTHCOriginUSD: string;
  buyTHCOriginJPY: string;
  buySealUSD: string;
  buySealJPY: string;
  buyDocFeeUSD: string;
  buyDocFeeJPY: string;
  buyOtherUSD: string;
  buyOtherJPY: string;
  buyTotalUSD: string;
  buyTotalJPY: string;
  selloceanfreightUSD: string;
  selloceanfreightJPY: string;
  sellSurrChargeUSD: string;
  sellSurrChargeJPY: string;
  sellTHCOriginUSD: string;
  sellTHCOriginJPY: string;
  sellSealUSD: string;
  sellSealJPY: string;
  sellDocFeeUSD: string;
  sellDocFeeJPY: string;
  sellOtherUSD: string;
  sellOtherJPY: string;
  sellTotalUSD: string;
  sellTotalJPY: string;
  createdBy: string;
  status(status: any): void;
  // Add other fields as needed
};

function BuyDetails() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<DataItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const classes = useStyles();
  const navigate = useNavigate();
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);

  useEffect(() => {
    // Make an API request using Axios to fetch data
    axios
      .get(`${BASE_URL}/api/BuySellRate/GetAllBuySellRate`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: any, status: any) => {
    try {
      // Show confirmation dialog
      confirmAlert({
        title: "Confirm to delete",
        message: "Are you sure you want to delete this item?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              try {
                // Perform the update status API call
                const response = await axios.patch(
                  `${BASE_URL}/api/BuySellRate/status/${id}`,
                  { status: 1 } // Set the new status value here
                );

                // Check if the update was successful
                if (response.statusText === "OK") {
                  alert("Data Deleted successfully");
                  location.reload();
                } else {
                  alert("Failed to update data status");
                }
              } catch (error) {
                console.error("Error updating data status:", error);
                alert("Error updating data status. Please try again.");
              }
            },
          },
          {
            label: "No",
            onClick: () => {
              // Do nothing if the user clicks "No"
            },
          },
        ],
      });
    } catch (error) {
      console.error("Error handling delete:", error);
      alert("Error handling delete. Please try again.");
    }
  };

  const handleEdit = async (id: any) => {
    try {
      navigate(`/EditItem/${id}`);
      // alert(id);
    } catch (error) {
      console.error("Error Switching", error);
      alert("Error Switching");
    }
  };

  const handleViewDetails = (row: DataItem) => {
    setSelectedRow(row);
    setIsDetailsPopupOpen(true);
  };

  const handleHideDetails = () => {
    setSelectedRow(null);
    setIsDetailsPopupOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <div>
        <NavbarDashboard />
        <h1 className="BuyDashboard">DASHBOARD</h1>

        <table className="DashbaordTable">
          <thead>
            <tr>
              <th>Number</th>
              <th>Port of Loading (POL)</th>
              <th>Port of Discharge (POD)</th>
              <th>Shipping Company</th>
              <th>Container Size</th>
              <th>Validity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{item.pol}</td>
                <td>{item.pod}</td>
                <td>{item.shippingCompany}</td>
                <td>{item.containerSize}</td>
                <td>
                  {new Date(item.validityFrom).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                  {" - "}
                  {new Date(item.validityTo).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </td>
                <td
                  style={{
                    display: "inline",
                    flexDirection: "row",
                    alignItems: "center",
                    border: "0px solid #ddd",
                  }}
                >
                  <Button
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(item)}
                    className={classes.button}
                    size="small"
                    // style={{ transform: "scale(0.9)" }}
                  ></Button>

                  <IconButton
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      padding: "8px",
                    }}
                    color="primary"
                    onClick={() => handleEdit(item.id)}
                  >
                    <EditIcon />
                  </IconButton>

                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(item.id, item.status)}
                    className={classes.deleteButton}
                    variant="contained"
                    size="small"
                    style={{ transform: "scale(0.8)" }}
                  ></Button>
                </td>
                {/* <td>
                  <button onClick={() => handleViewDetails(item)}>
                    View Details
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <br></br>
        <div className="pagination" style={{ paddingLeft: "20px" }}>
          {Array.from(
            { length: Math.ceil(data.length / itemsPerPage) },
            (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
      {selectedRow && (
        <DetailsPopup
          open={isDetailsPopupOpen}
          selectedRow={selectedRow}
          onClose={handleHideDetails}
        />
      )}
    </>
  );
}

// type DetailsPopupProps = {
//   selectedRow: DataItem;
//   onClose: () => void;
// };
type DetailsPopupProps = {
  open: boolean; // Add 'open' prop to indicate whether the popup is open
  selectedRow: DataItem;
  onClose: () => void;
};

function DetailsPopup({ open, onClose, selectedRow }: DetailsPopupProps) {
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box className="modal-container">
          <div className={`popup ${selectedRow ? "active" : ""}`}>
            <div className="popup-content">
              <span className="close" onClick={onClose}>
                &times;
              </span>
              <h2 className="DetailsDashboard">Details</h2>
              <div className="horizontal-layout">
                <table>
                  <tr>
                    <td className="detail-label">Port of Loading :- </td>
                    <td className="detail-value">{selectedRow.pol}</td>
                    <td className="detail-label">Port of Discharge:- </td>
                    <td className="detail-value">{selectedRow.pod}</td>
                    <td className="detail-label">Port of Reciept :- </td>
                    <td className="detail-value">{selectedRow.por}</td>
                    <td className="detail-label">
                      Final Place of Delievery:-{" "}
                    </td>
                    <td className="detail-value">
                      {selectedRow.finalPlaceDelivery}
                    </td>
                  </tr>
                  <tr>
                    <td className="detail-label">Shipping Company :- </td>
                    <td className="detail-value">
                      {selectedRow.shippingCompany}
                    </td>
                    <td className="detail-label">Container Size :- </td>
                    <td className="detail-value">
                      {selectedRow.containerSize}
                    </td>
                    <td className="detail-label">Contract/Spot Type :- </td>
                    <td className="detail-value">
                      {selectedRow.contractSpotType}
                    </td>
                  </tr>
                  <tr>
                    <td className="detail-label">Validity :- </td>
                    <td className="detail-value">
                      {new Date(selectedRow.validityFrom).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                      {"   "}
                      TO{" "}
                      {new Date(selectedRow.validityTo).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </td>
                  </tr>

                  <tbody>
                    <tr>
                      <th className="detail-label"></th>
                      <th className="detail-label">Buy Rate ($)</th>
                      <th className="detail-label">Buy Rate (¥)</th>
                    </tr>
                    <tr>
                      <td className="detail-label">Ocean Freight : </td>
                      <td className="detail-value">
                        {selectedRow.buyoceanfreightUSD}
                      </td>
                      <td className="detail-value">
                        {selectedRow.buyoceanfreightJPY}
                      </td>
                    </tr>
                    <tr>
                      <td className="detail-label">Surr Charge : </td>
                      <td className="detail-value">
                        {selectedRow.buySurrChargeUSD}
                      </td>
                      <td className="detail-value">
                        {selectedRow.buySurrChargeJPY}
                      </td>
                    </tr>
                    <tr>
                      <td className="detail-label">THC Origin : </td>
                      <td className="detail-value">
                        {selectedRow.buyTHCOriginUSD}
                      </td>
                      <td className="detail-value">
                        {selectedRow.buyTHCOriginJPY}
                      </td>
                    </tr>
                    <tr>
                      <td className="detail-label"> Seal: </td>
                      <td className="detail-value">{selectedRow.buySealUSD}</td>
                      <td className="detail-value">{selectedRow.buySealJPY}</td>
                    </tr>
                    <tr>
                      <td className="detail-label">DOC Fee : </td>
                      <td className="detail-value">
                        {selectedRow.buyDocFeeUSD}
                      </td>
                      <td className="detail-value">
                        {selectedRow.buyDocFeeJPY}
                      </td>
                    </tr>
                    <tr>
                      <td className="detail-label">Other : </td>
                      <td className="detail-value">
                        {selectedRow.buyOtherUSD}
                      </td>
                      <td className="detail-value">
                        {selectedRow.buyOtherJPY}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="detail-label">TOTAL</td>
                      <td className="detail-value">
                        {selectedRow.buyTotalUSD} $
                      </td>
                      <td className="detail-value">
                        {selectedRow.buyTotalJPY} ¥
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}

// function DetailsPopup({ selectedRow, onClose }: DetailsPopupProps) {
//   return (
//     <>
//       <div className="PopupItems">
//         <div className={`popup ${selectedRow ? "active" : ""}`}>
//           <div className="popup-content">
//             <span className="close" onClick={onClose}>
//               &times;
//             </span>
//             <h2>Details</h2>
//             <div className="horizontal-layout">
//               <table>
//                 <tr>
//                   <td className="detail-label">Port of Loading :- </td>
//                   <td className="detail-value">{selectedRow.pol}</td>
//                   <td className="detail-label">Port of Discharge:- </td>
//                   <td className="detail-value">{selectedRow.pod}</td>
//                   <td className="detail-label">Port of Reciept :- </td>
//                   <td className="detail-value">{selectedRow.por}</td>
//                   <td className="detail-label">Final Place of Delievery:- </td>
//                   <td className="detail-value">
//                     {selectedRow.finalPlaceDelivery}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="detail-label">Shipping Company :- </td>
//                   <td className="detail-value">
//                     {selectedRow.shippingCompany}
//                   </td>
//                   <td className="detail-label">Container Size :- </td>
//                   <td className="detail-value">{selectedRow.containerSize}</td>
//                   <td className="detail-label">Contract/Spot Type :- </td>
//                   <td className="detail-value">
//                     {selectedRow.contractSpotType}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="detail-label">Validity :- </td>
//                   <td className="detail-value">
//                     {new Date(selectedRow.validityFrom).toLocaleDateString(
//                       undefined,
//                       {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       }
//                     )}{" "}
//                     TO{" "}
//                   </td>
//                   <td style={{ fontSize: "12px" }}>
//                     {new Date(selectedRow.validityTo).toLocaleDateString(
//                       undefined,
//                       {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       }
//                     )}
//                   </td>
//                 </tr>
//                 <tr>
//                   <th className="detail-label"></th>
//                   <th className="detail-label">Buy Rate ($)</th>
//                   <th className="detail-label">Buy Rate (¥)</th>
//                 </tr>
//                 <tbody>
//                   <tr>
//                     <td className="detail-label">Ocean Freight : </td>
//                     <td className="detail-value">
//                       {selectedRow.buyoceanfreightUSD}
//                     </td>
//                     <td className="detail-value">
//                       {selectedRow.buyoceanfreightJPY}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="detail-label">Surr Charge : </td>
//                     <td className="detail-value">
//                       {selectedRow.buySurrChargeUSD}
//                     </td>
//                     <td className="detail-value">
//                       {selectedRow.buySurrChargeJPY}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="detail-label">THC Origin : </td>
//                     <td className="detail-value">
//                       {selectedRow.buyTHCOriginUSD}
//                     </td>
//                     <td className="detail-value">
//                       {selectedRow.buyTHCOriginJPY}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="detail-label"> Seal: </td>
//                     <td className="detail-value">{selectedRow.buySealUSD}</td>
//                     <td className="detail-value">{selectedRow.buySealJPY}</td>
//                   </tr>
//                   <tr>
//                     <td className="detail-label">DOC Fee : </td>
//                     <td className="detail-value">{selectedRow.buyDocFeeUSD}</td>
//                     <td className="detail-value">{selectedRow.buyDocFeeJPY}</td>
//                   </tr>
//                   <tr>
//                     <td className="detail-label">Other : </td>
//                     <td className="detail-value">{selectedRow.buyOtherUSD}</td>
//                     <td className="detail-value">{selectedRow.buyOtherJPY}</td>
//                   </tr>
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td className="detail-label">TOTAL</td>
//                     <td className="detail-value">
//                       {selectedRow.buyTotalUSD} $
//                     </td>
//                     <td className="detail-value">
//                       {selectedRow.buyTotalJPY} ¥
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

export default BuyDetails;
