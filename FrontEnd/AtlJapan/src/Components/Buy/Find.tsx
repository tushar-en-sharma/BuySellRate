import NavbarDashboard from "../Navbar/NavbarDashboard";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
// import Stack from "@mui/material/Stack";
import "react-responsive-modal/styles.css";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Find.css";
import { confirmAlert } from "react-confirm-alert"; // Import the library
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the styles
import { makeStyles, createTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";

type Option = { key: string; value: string };
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const theme = createTheme();

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
    padding: "6px 6px", // Adjusted padding for a smaller size
    fontSize: "14px", // Adjusted font size for a smaller size
    "&:hover": {
      backgroundColor: "#d32f2f",
    },
  },
}));

function FindBuyRate() {
  const [apiResponse, setApiResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [portOptions, setPortOptions] = useState<string[]>([]);
  const [containerSizeOptions, setContainerSizeOptions] = useState<string[]>(
    []
  );
  const [shippingCompanyOptions, setShippingCompanyOptions] = useState<
    string[]
  >([]);
  const [contractSpotOptions, setContractSpotOptions] = useState<string[]>([]);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    navigate("/AddBuySellRate");
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data
        const response = await axios.get(
          `${BASE_URL}/api/MasterTable`
        );
        const data = response.data;

        // Extract options for each field
        const portOptions = data.map((entry: any) => entry.port);
        const containerSizeOptions = data.map(
          (entry: any) => entry.ContainerSize
        );
        const shippingCompanyOptions = data.map(
          (entry: any) => entry.ShippingCompany
        );
        const contractSpotOptions = data.map(
          (entry: any) => entry.ContractSpotType
        );

        // Set options for each field
        setPortOptions(portOptions);
        setContainerSizeOptions(containerSizeOptions);
        setShippingCompanyOptions(shippingCompanyOptions);
        setContractSpotOptions(contractSpotOptions);
      } catch (error) {
        // Handle any potential errors here
        alert("Unable to fetech Data from DB");
        console.log(error);
      }
    }

    // Trigger the fetch
    fetchData();
  }, []);

  return (
    <>
      <NavbarDashboard />
      <div className="Findscreenlayout">
        <div className="imageWithText">
          <a href="/dashboard">
            <img id="titlepic" src="titlearrow.png" alt="arrow" />
          </a>
          <h2 style={{ paddingTop: "8px" }}>Find Buy Rate</h2>
        </div>
        <br></br>
        <div>
          <Formik
            initialValues={{
              PortofReciept: "",
              PortofLanding: "",
              PortofDischarge: "",
              FinalPlaceDelivery: "",
              ShippingCompany: "",
              ContainerSize: "",
              Validity: "",
              ContractSpotType: "",
            }}
            onSubmit={async (values) => {
              try {
                const encodedContainerSize = encodeURIComponent(
                  values.ContainerSize
                );
                const encodedValidity = encodeURIComponent(values.Validity);
                const response = await axios.get(
                  `${BASE_URL}/api/BuySellRate/FindBuySellRate?pol=${values.PortofLanding}&pod=${values.PortofDischarge}&ContainerSize=${encodedContainerSize}`
                );

                const data = response.data;
                console.log(JSON.stringify(data, null, 2));
                setApiResponse(data);
                setShowModal(true);
              } catch (error) {
                alert("Data Not Found or Invalid, Please Enter Correct Data");
                console.log(error);
                // alert(JSON.stringify(data, null, 2));
              }
            }}
          >
            <Form>
              <div className="FindBuyRateOptions">
                <div className="input-section">
                  <label htmlFor="PortofLanding">Port of Loading(POL):-</label>
                  <Field
                    as="select"
                    id="PortofLanding"
                    name="PortofLanding"
                    placeholder="POL"
                  >
                    <option value="">Select a port</option>
                    {portOptions
                      .filter((port) => port !== null && port !== "NULL")
                      .map((port, index) => (
                        <option key={index} value={port}>
                          {port}
                        </option>
                      ))}
                  </Field>
                  <label htmlFor="PortofDischarge">
                    Port of Discharge(POD):-
                  </label>
                  <Field
                    as="select"
                    id="PortofDischarge"
                    name="PortofDischarge"
                    placeholder="POD"
                  >
                    <option value="">Select a port</option>
                    {portOptions
                      .filter((port) => port !== null && port !== "NULL")
                      .map((port, index) => (
                        <option key={index} value={port}>
                          {port}
                        </option>
                      ))}
                  </Field>
                  <label htmlFor="PortofDischarge">Container Type:-</label>
                  <Field
                    as="select"
                    id="ContainerSize"
                    name="ContainerSize"
                    placeholder="Container Size"
                  >
                    <option value="">Select a container size</option>
                    {containerSizeOptions
                      .filter((size) => size !== null && size !== "NULL")
                      .map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                  </Field>
                </div>

                <div className="button-section">
                  <Button
                    variant="outlined"
                    type="submit"
                    endIcon={<SearchIcon />}
                  >
                    Find
                  </Button>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
      <ApiResponseModal
        open={showModal}
        onClose={() => setShowModal(false)}
        data={apiResponse}
      />
    </>
  );
}

type ApiResponseData = {
  slice(startIndex: number, endIndex: number): any;
  map(
    arg0: (
      item: {
        pol:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactPortal
          | Iterable<ReactNode>
          | null
          | undefined;
        pod:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactPortal
          | Iterable<ReactNode>
          | null
          | undefined;
        shippingCompany:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactPortal
          | Iterable<ReactNode>
          | null
          | undefined;
      },
      index: Key | null | undefined
    ) => import("react/jsx-runtime").JSX.Element
  ): ReactNode;
  id: number;
  por: string;
  pol: string;
  pod: string;
  finalPlaceDelivery: string;
  shippingCompany: string;
  containerSize: string;
  contractSpotType: string;
  validity: string;
  createdBy: string;
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
  buyTotalUSD: string;
  buyTotalJPY: string;
  sellTotalUSD: string;
  sellTotalJPY: string;
};

type ApiResponseModalProps = {
  open: boolean;
  onClose: () => void;
  data: ApiResponseData | null; // Replace YourResponseType with the actual type of your API response
};

function ApiResponseModal({ open, onClose, data }: ApiResponseModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const classes = useStyles();

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

  // const handleDelete = async (id: any) => {
  //   try {
  //     // Show confirmation dialog
  //     confirmAlert({
  //       title: "Confirm to delete",
  //       message: "Are you sure you want to delete this item?",
  //       buttons: [
  //         {
  //           label: "Yes",
  //           onClick: async () => {
  //             // Perform the delete API call, replace 'yourDeleteApiUrl' with your actual delete API endpoint
  //             const response = await axios.delete(
  //               `http://localhost:5291/api/BuySellRate/${id}`
  //             );

  //             // Check if the delete was successful
  //             if (response.status === 204) {
  //               alert("Data deleted successfully"); // You can replace this with any notification mechanism you prefer
  //               location.reload();
  //             } else {
  //               alert("Failed to delete data");
  //             }
  //           },
  //         },
  //         {
  //           label: "No",
  //           onClick: () => {
  //             // Do nothing if the user clicks "No"
  //           },
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     console.error("Error deleting data:", error);
  //     alert("Error deleting data. Please try again.");
  //   }
  // };

  const handleEdit = async (id: any) => {
    try {
      navigate(`/EditItem/${id}`);
      // alert(id);
    } catch (error) {
      console.error("Error Switching", error);
      alert("Error Switching");
    }
  };

  function handleAllDetails(id: any): void {
    try {
      navigate(`/DetailItem/${id}`);
    } catch (error) {
      alert("Unable to open the Details");
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Calculate the data to be displayed based on currentPage and itemsPerPage
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const slicedData = data ? data.slice(startIndex, endIndex) : [];

  return (
    <div>
      {slicedData.length > 0 ? (
        <div>
          <table className="FindBuyRateCSS">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Index</th>
                <th style={{ textAlign: "center" }}>Shipping Company</th>
                <th style={{ textAlign: "center" }}>Port of Loading</th>
                <th style={{ textAlign: "center" }}>Port of Discharge</th>
                <th style={{ textAlign: "center" }}>ContainerSize</th>
                <th style={{ textAlign: "center" }}>Buy Rate ($)</th>
                <th style={{ textAlign: "center" }}>Validity</th>
                <th style={{ textAlign: "center" }}>Expiration</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slicedData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.shippingCompany}</td>
                  <td>{item.pol}</td>
                  <td>{item.pod}</td>
                  <td>{item.containerSize}</td>
                  <td>{item.buyTotalUSD} $</td>
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
                  <td>
                    {item.validityTo && item.validityTo !== ""
                      ? `${Math.floor(
                          (new Date(item.validityTo).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days left`
                      : "No validity set"}
                  </td>
                  <td>
                    <Button
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleAllDetails(item.id)}
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
                      onClick={() => handleDelete(item.id)}
                      className={classes.deleteButton}
                      variant="contained"
                      size="small"
                      style={{ transform: "scale(0.8)" }}
                    ></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br></br>
          {data.length > itemsPerPage && (
            <div className="pagination" style={{ paddingLeft: "5px" }}>
              {Array.from(
                { length: Math.ceil(data.length / itemsPerPage) },
                (_, i) => (
                  <button key={i} onClick={() => handlePageChange(i)}>
                    {i + 1}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="loading-text"></p>
      )}
    </div>
  );
}

export default FindBuyRate;
