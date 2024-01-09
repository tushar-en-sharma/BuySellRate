import NavbarDashboard from "../Navbar/NavbarDashboard";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
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
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import "./Find.css";
import { confirmAlert } from "react-confirm-alert";

const theme = createMuiTheme();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useStyles = makeStyles((theme) => ({
  button: {
    border: "2px solid #2196f3", // Blue border
    borderRadius: "8px", // Rounded corners
    padding: "10px 20px", // Padding
    margin: "10px", // Margin
    textTransform: "none", // Avoid uppercase text
    fontSize: "12px", // Font size
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

type Option = { key: string; value: string };

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

function AllocateSellRate() {
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
  const [customerOptions, setCustomerOptions] = useState<string[]>([]);

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
        // console.log("response : ", data);

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
        const customerOptions = data.map((entry: any) => entry.CustomerName);
        // console.log(customerOptions);

        // Set options for each field
        setPortOptions(portOptions);
        setContainerSizeOptions(containerSizeOptions);
        setShippingCompanyOptions(shippingCompanyOptions);
        setContractSpotOptions(contractSpotOptions);
        setCustomerOptions(customerOptions);
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
          <a href="/DashboardSell">
            <img id="titlepic" src="titlearrow.png" alt="arrow" />
          </a>
          <h2 style={{ paddingTop: "8px" }}>Find Sell Rate</h2>
        </div>
        <div>
          <Formik
            initialValues={{
              PortofReciept: "",
              PortofLanding: "",
              PortofDischarge: "",
              FinalPlaceDelivery: "",
              ShippingCompany: "",
              ContainerSize: "",
              ValidityFrom: "",
              ValidityTo: "",
              ContractSpotType: "",
              Customer: "",
            }}
            onSubmit={async (values) => {
              try {
                const encodedContainerSize = encodeURIComponent(
                  values.ContainerSize
                );
                // const encodedValidity = encodeURIComponent(values.Validity);

                const url = `${BASE_URL}/api/SellRate/GetSellRate?pol=${
                  values.PortofLanding
                }&pod=${
                  values.PortofDischarge
                }&CustomerName=${encodeURIComponent(
                  values.Customer
                )}&ShippingCompany=${
                  values.ShippingCompany
                }&ContainerSize=${encodeURIComponent(
                  values.ContainerSize
                )}&ContractSpotType=${
                  values.ContractSpotType
                }&ValidityFrom=${encodeURIComponent(
                  values.ValidityFrom
                )}&ValidityTo=${encodeURIComponent(values.ValidityTo)}`;
                console.log(url);
                const response = await axios.get(url);
                const data = response.data;
                // console.log(JSON.stringify(data.products, null, 2));
                setApiResponse(data.products);
                setShowModal(true);
              } catch (error) {
                alert("Data Not Found or Invalid, Please Enter Correct Data");
                console.log(error);
                // alert(JSON.stringify(data, null, 2));
              }
            }}
          >
            <Form>
              <table className="findsellfeilds">
                <tr>
                  <td>
                    <label htmlFor="Customer">Customer Name:-</label>
                    <Field
                      as="select"
                      id="Customer"
                      name="Customer"
                      placeholder="Customer"
                    >
                      <option value="">Select a Customer</option>
                      {customerOptions
                        .filter(
                          (customer) => customer !== null && customer !== "NULL"
                        )
                        .map((customer, index) => (
                          <option key={index} value={customer}>
                            {customer}
                          </option>
                        ))}
                    </Field>
                  </td>
                  <td>
                    <label htmlFor="PortofLanding">
                      Port of Loading(POL):-
                    </label>
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
                  </td>
                  <td>
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
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="ShippingCompany">Shipping Company:-</label>
                    <Field
                      as="select"
                      id="ShippingCompany"
                      name="ShippingCompany"
                      placeholder="Shipping Company"
                    >
                      <option value="">Select a Shipping Company</option>
                      {shippingCompanyOptions
                        .filter(
                          (company) => company !== null && company !== "NULL"
                        )
                        .map((company, index) => (
                          <option key={index} value={company}>
                            {company}
                          </option>
                        ))}
                    </Field>
                  </td>
                  <td>
                    <label htmlFor="ContainerSize">Container Size:-</label>
                    <Field
                      as="select"
                      id="ContainerSize"
                      name="ContainerSize"
                      placeholder="Container Size"
                    >
                      <option value="">Select a Container Size</option>
                      {containerSizeOptions
                        .filter((size) => size !== null && size !== "NULL")
                        .map((size, index) => (
                          <option key={index} value={size}>
                            {size}
                          </option>
                        ))}
                    </Field>
                  </td>
                  <td>
                    <label htmlFor="ContractSpotType">
                      Contract/Spot Type:-
                    </label>
                    <Field
                      as="select"
                      id="ContractSpotType"
                      name="ContractSpotType"
                      placeholder="Contract/Spot Type"
                    >
                      <option value="">Select Contract or Spot Type</option>
                      {contractSpotOptions
                        .filter((type) => type !== null && type !== "NULL")
                        .map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                    </Field>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="ValidityFrom">Validity From:-</label>
                    <Field
                      type="date"
                      id="ValidityFrom"
                      name="ValidityFrom"
                      placeholder="Validity From"
                    />
                  </td>
                  <td>
                    <label htmlFor="ValidityTo">Validity To:-</label>
                    <Field
                      type="date"
                      id="ValidityTo"
                      name="ValidityTo"
                      placeholder="Validity To"
                    />
                  </td>
                </tr>
                <tr className="addrows">
                  <Button
                    variant="outlined"
                    type="submit"
                    endIcon={<SearchIcon />}
                  >
                    Find
                  </Button>
                </tr>
              </table>
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
  customer: string;
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
  status(status: any): void;
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
                  `${BASE_URL}/api/SellRate/status/${id}`,
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
      navigate(`/EditSellItem/${id}`);
      // alert(id);
    } catch (error) {
      console.error("Error Switching", error);
      alert("Error Switching");
    }
  };

  function handleAllDetails(id: any): void {
    try {
      navigate(`/SellItemDetail/${id}`);
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
    // <Modal open={open} onClose={onClose}>
    // <Box className="modal-container" sx={style}>
    <div>
      {slicedData.length > 0 ? (
        <div className="SellDashboard">
          <h1> Details:</h1>
          <table className="SellDashbaordTable">
            <thead>
              <tr>
                <th>Index</th>
                <th>Customer</th>
                <th>Port of Loading</th>
                <th>Port of Discharge</th>
                <th>Shipping Company</th>
                <th>Rate($)</th>
                {/* <th>Rate(¥)</th> */}
                <th>Validity</th>
                <th>Expiration</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slicedData.map((item, index) => (
                <tr key={index} style={{ border: "1px solid #ddd" }}>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {index + 1}
                  </td>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {item.customer}
                  </td>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {item.pol}
                  </td>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {item.pod}
                  </td>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {item.shippingCompany}
                  </td>
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {item.sellTotalUSD} $
                  </td>
                  {/* <td
                      style={{ borderRight: "1px solid #ddd", padding: "8px" }}
                    >
                      {item.sellTotalJPY} ¥
                    </td> */}
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
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
                  <td style={{ borderRight: "1px solid #ddd", padding: "8px" }}>
                    {item.validityTo && item.validityTo !== ""
                      ? `${Math.floor(
                          (new Date(item.validityTo).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days left`
                      : "No validity set"}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "8px",
                    }}
                  >
                    <div>
                      <Button
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleAllDetails(item.id)}
                        className={classes.button}
                        size="small"
                      >
                        View
                      </Button>
                    </div>

                    <div>
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
                    </div>

                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(item.id, item.status)}
                      className={classes.deleteButton}
                      variant="contained"
                      size="small"
                      style={{ transform: "scale(0.7)" }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > itemsPerPage && (
            <div className="pagination">
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
    // </Box>
    // </Modal>
  );
}

export default AllocateSellRate;
