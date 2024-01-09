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
import "./Add.css";

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

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AddSellRate() {
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
        const response = await axios.get(`${BASE_URL}/api/MasterTable`);
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
        alert(error);
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
          <h2 style={{ paddingTop: "8px" }}>Add Sell Rate</h2>
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
            }}
            onSubmit={async (values) => {
              try {
                const encodedContainerSize = encodeURIComponent(
                  values.ContainerSize
                );
                const encodedValidityFrom = encodeURIComponent(
                  values.ValidityFrom
                );
                const encodedValidityTo = encodeURIComponent(values.ValidityTo);
                const encodedPortofLanding = encodeURIComponent(
                  values.PortofLanding
                );
                const encodedPortofDischarge = encodeURIComponent(
                  values.PortofDischarge
                );
                const encodedShippingCompany = encodeURIComponent(
                  values.ShippingCompany
                );

                try {
                  const response = await axios.get(
                    `${BASE_URL}/api/BuySellRate/GetBuyRate?pol=${encodedPortofLanding}&pod=${encodedPortofDischarge}&ValidityFrom=${encodedValidityFrom}&ValidityTo=${encodedValidityTo}`
                  );
                  //   `http://localhost:5291/api/BuySellRate/GetBuyRate?pol=${encodedPortofLanding}&pod=${encodedPortofDischarge}&ShippingCompany=${encodedShippingCompany}&ValidityFrom=${encodedValidityFrom}&ValidityTo=${encodedValidityTo}`
                  // );
                  const data = response.data;
                  console.log(data);

                  if (data.products && data.products.length > 0) {
                    console.log("Products:", data.products);
                    console.log("Message:", data.message);
                    setApiResponse(data.products);
                    setShowModal(true);
                    // Handle the products and message as needed
                  } else {
                    console.log("No products found");
                    console.log(data.products);

                    // Handle the case where no products are found
                  }
                } catch (error) {
                  console.error("Error fetching data:", error);
                  alert("No products found");
                  // Handle the error as needed
                }
              } catch (error) {
                alert("Data Not Found or Invalid, Please Enter Correct Data");
                console.log(error);
                // alert(JSON.stringify(data, null, 2));
              }
            }}
          >
            <Form>
              <table>
                <tr className="addrows">
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
                    <label htmlFor="Validity">Validity:-</label>
                    <Field
                      type="date"
                      id="ValidityFrom"
                      name="ValidityFrom"
                      placeholder="Validity Date"
                    />
                    {"  "}
                    to{" "}
                  </td>
                  <td>
                    <Field
                      type="date"
                      id="ValidityTo"
                      name="ValidityTo"
                      placeholder="Validity Date"
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
  const itemsPerPage = 3;
  const navigate = useNavigate();

  const handleEdit = async (id: any) => {
    try {
      navigate(`/EditItem/${id}`);
      // alert(id);
    } catch (error) {
      console.error("Error Switching", error);
      alert("Error Switching");
    }
  };

  function handleAddSellRate(id: any): void {
    try {
      navigate(`/AddSellDetails/${id}`);
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
        <div>
          <h1 className="response-title">
            <span>Details:-</span>
            <div className="button-container"></div>
          </h1>
          <table className="DashbaordTable">
            <thead>
              <tr>
                <th>Index</th>
                <th>Shipping Company</th>
                <th>Port of Loading</th>
                <th>Port of Discharge</th>
                <th>Container Type</th>
                <th>Buy Rate ($)</th>
                <th>Validity</th>
                <th>Expiration</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slicedData.map(
                (
                  item: {
                    id(id: any): void;
                    buyTotalUSD: ReactNode;
                    sellTotalUSD: ReactNode;
                    containerSize: string;
                    validityFrom: string | number | Date;
                    validityTo: string | number | Date;
                    pol:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | null
                      | undefined;
                    pod:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | null
                      | undefined;
                    shippingCompany:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | null
                      | undefined;
                  },
                  index: Key | null | undefined
                ) => (
                  <tr key={index}>
                    <td> {index + 1} </td>
                    <td>{item.shippingCompany}</td>
                    <td>{item.pol}</td>
                    <td>{item.pod}</td>
                    <td>{item.containerSize}</td>
                    <td>{item.buyTotalUSD} $</td>
                    <td>
                      {new Date(item.validityFrom).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                      {" - "}
                      {new Date(item.validityTo).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
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
                        style={{ width: "165px", height: "25px" }}
                        variant="contained"
                        onClick={() => handleAddSellRate(item.id)}
                      >
                        Add Sell Rate
                      </Button>
                    </td>
                  </tr>
                )
              )}
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

export default AddSellRate;
