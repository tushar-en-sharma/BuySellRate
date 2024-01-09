import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import Button from "@mui/material/Button";
import NavbarDashboard from "../Navbar/NavbarDashboard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define an interface for the expected shape of currentValues
interface CurrentValues {
  customer: string;
  por: string;
  pol: string;
  pod: string;
  finalPlaceDelivery: string;
  shippingCompany: string;
  containerSize: string;
  contractSpotType: string;
  validityFrom: string;
  validityTo: string;
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
  // Add other fields here
}

function EditSellItem() {
  const [selectedCurrencies, setSelectedCurrencies] = useState({
    buyocean: "USD",
    buysurr: "USD",
    buythc: "USD",
    buyseal: "USD",
    buydocfee: "USD",
    buyother: "USD",
    sellocean: "USD",
    sellsurr: "USD",
    sellthc: "USD",
    sellseal: "USD",
    selldocfee: "USD",
    sellother: "USD",

    // Include other currency states here
  });

  const handleCurrencyChange = (currencyType: string, value: string) => {
    setSelectedCurrencies({
      ...selectedCurrencies,
      [currencyType]: value,
    });
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [currentValues, setCurrentValues] = useState<CurrentValues | null>(
    null
  );
  const [masterTableData, setMasterTableData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the BuySellRate API
        const response = await axios.get(
          `${BASE_URL}/api/SellRate/${id}`
        );
        const currentData = response.data;
        console.log(currentData);

        // Fetch data from the MasterTable API
        const masterTableResponse = await axios.get(
          `${BASE_URL}/api/MasterTable`
        );
        const masterTableData = masterTableResponse.data;

        setCurrentValues(currentData);
        setMasterTableData(masterTableData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (values: CurrentValues) => {
    // console.log(values);
    try {
      values.buyTotalUSD = (
        parseFloat(values.buyoceanfreightUSD) +
        parseFloat(values.buySurrChargeUSD) +
        parseFloat(values.buyTHCOriginUSD) +
        parseFloat(values.buySealUSD) +
        parseFloat(values.buyDocFeeUSD) +
        parseFloat(values.buyOtherUSD)
      ).toString();

      values.buyTotalJPY = (
        parseFloat(values.buyoceanfreightJPY) +
        parseFloat(values.buySurrChargeJPY) +
        parseFloat(values.buyTHCOriginJPY) +
        parseFloat(values.buySealJPY) +
        parseFloat(values.buyDocFeeJPY) +
        parseFloat(values.buyOtherJPY)
      ).toString();

      values.sellTotalUSD = (
        parseFloat(values.selloceanfreightUSD) +
        parseFloat(values.sellSurrChargeUSD) +
        parseFloat(values.sellTHCOriginUSD) +
        parseFloat(values.sellSealUSD) +
        parseFloat(values.sellDocFeeUSD) +
        parseFloat(values.sellOtherUSD)
      ).toString();

      values.sellTotalJPY = (
        parseFloat(values.selloceanfreightJPY) +
        parseFloat(values.sellSurrChargeJPY) +
        parseFloat(values.sellTHCOriginJPY) +
        parseFloat(values.sellSealJPY) +
        parseFloat(values.sellDocFeeJPY) +
        parseFloat(values.sellOtherJPY)
      ).toString();

      // console.log(values);
      // alert(JSON.stringify(values, null, 2));
      console.log(JSON.stringify(values, null, 2));
      await axios.put(`${BASE_URL}/api/SellRate/${id}`, values);
      alert("Data updated successfully");
      //   console.log(values);
      navigate(`/DashboardSell`);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data. Please try again.");
    }
  };

  return (
    <>
      <NavbarDashboard />
      <div>
        <h2 className="Dashboard-text">Edit Fields</h2>
        {currentValues && (
          <Formik initialValues={currentValues} onSubmit={handleUpdate}>
            {({ values, handleChange }) => (
              <Form>
                <tr>
                  <td>
                    <label htmlFor="pol">Port of Loading:</label>
                    <Field
                      as="select"
                      id="pol"
                      name="pol"
                      value={values.pol}
                      onChange={handleChange}
                      disabled={true}
                    >
                      <option value="">Select a port</option>
                      {masterTableData
                        .filter(
                          (entry) =>
                            entry.port !== null && entry.port !== "NULL"
                        )
                        .map((entry: any) => (
                          <option key={entry.id} value={entry.port}>
                            {entry.port}
                          </option>
                        ))}
                    </Field>
                  </td>
                  <td>
                    <label htmlFor="pod">Port of Discharge:</label>
                    <Field
                      as="select"
                      id="pod"
                      name="pod"
                      value={values.pod}
                      onChange={handleChange}
                      disabled={true}
                    >
                      <option value="">Select a port</option>
                      {masterTableData
                        .filter(
                          (entry) =>
                            entry.port !== null && entry.port !== "NULL"
                        )
                        .map((entry: any) => (
                          <option key={entry.id} value={entry.port}>
                            {entry.port}
                          </option>
                        ))}
                    </Field>
                  </td>
                  <td>
                    <label htmlFor="shippingCompany">Shipping Company:</label>
                    <Field
                      as="select"
                      id="shippingCompany"
                      name="shippingCompany"
                      value={values.shippingCompany}
                      onChange={handleChange}
                      disabled={true}
                    >
                      <option value="">Select a shipping company</option>
                      {masterTableData
                        .map((entry: any) => entry.ShippingCompany)
                        .filter(
                          (company: any) =>
                            company !== null && company !== "NULL"
                        )
                        .map((company: any, index: number) => (
                          <option key={index} value={company}>
                            {company}
                          </option>
                        ))}
                    </Field>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="por">Port of Receipt:</label>
                    <Field
                      as="select"
                      id="por"
                      name="por"
                      value={values.por}
                      onChange={handleChange}
                    >
                      <option value="">Select a port</option>
                      {masterTableData
                        .filter(
                          (entry) =>
                            entry.port !== null && entry.port !== "NULL"
                        )
                        .map((entry: any) => (
                          <option key={entry.id} value={entry.port}>
                            {entry.port}
                          </option>
                        ))}
                    </Field>
                  </td>
                  <td>
                    <label htmlFor="finalPlaceDelivery">
                      {" "}
                      Final Place Delivery:
                    </label>
                    <Field
                      as="select"
                      id="finalPlaceDelivery"
                      name="finalPlaceDelivery"
                      value={values.finalPlaceDelivery}
                      onChange={handleChange}
                    >
                      <option value="">Select a port</option>
                      {masterTableData
                        .filter(
                          (entry) =>
                            entry.port !== null && entry.port !== "NULL"
                        )
                        .map((entry: any) => (
                          <option key={entry.id} value={entry.port}>
                            {entry.port}
                          </option>
                        ))}
                    </Field>
                  </td>
                  <td>
                    <label htmlFor="containerSize"> Container Size:</label>
                    <Field
                      as="select"
                      id="containerSize"
                      name="containerSize"
                      value={values.containerSize}
                      onChange={handleChange}
                    >
                      <option value="">Select a Size</option>
                      {masterTableData
                        .map((entry: any) => entry.ContainerSize)
                        .filter((size: any) => size !== null && size !== "NULL")
                        .map((size: any, index: number) => (
                          <option key={index} value={size}>
                            {size}
                          </option>
                        ))}
                    </Field>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="contractSpotType">
                      Contract/Spot Type:
                    </label>
                    <Field
                      as="select"
                      id="contractSpotType"
                      name="contractSpotType"
                      value={values.contractSpotType}
                      onChange={handleChange}
                    >
                      <option value="">Select Contract or Spot</option>
                      {masterTableData
                        .map((entry: any) => entry.ContractSpotType)
                        .filter((type: any) => type !== null && type !== "NULL")
                        .map((type: any, index: number) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                    </Field>
                  </td>
                  <td>
                    <label htmlFor="Validity" style={{ paddingRight: "10px" }}>
                      Validity:
                    </label>
                    <div
                      className="date-box"
                      style={{
                        display: "inline-block",
                        border: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      {new Date(currentValues.validityFrom).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}{" "}
                      TO{" "}
                      {new Date(currentValues.validityTo).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </td>
                  <td>
                    <label htmlFor="Customer">Customer:</label>
                    <Field
                      as="select"
                      id="Customer"
                      name="Customer"
                      value={values.customer}
                      onChange={handleChange}
                      // disabled={true}
                    >
                      <option value="">Select Customer</option>
                      {masterTableData
                        .map((entry: any) => entry.CustomerName)
                        .filter((type: any) => type !== null && type !== "NULL")
                        .map((type: any, index: number) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                    </Field>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="usdRate">USD Rate:</label>
                    <Field
                      type="text"
                      id="usdRate"
                      name="usdRate"
                      value={values.usdRate}
                      placeholder={values.usdRate}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <label htmlFor="jpyRate">JPY Rate:</label>
                    <Field
                      type="text"
                      id="jpyRate"
                      name="jpyRate"
                      value={values.jpyRate}
                      placeholder={values.jpyRate}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <table>
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: "2px" }}> Name</th>
                      {/* <th>BUY Rate ($)</th>
                      <th>BUY Rate (¥)</th> */}
                      <th>SELL Rate ($)</th>
                      <th>SELL Rate (¥)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="buyoceanfreightUSD">
                          Ocean Freight :-
                        </label>
                      </td>
                      {/* <td>
                        <Field
                          type="text"
                          id="buyoceanfreightUSD"
                          name="buyoceanfreightUSD"
                          value={values.buyoceanfreightUSD}
                          placeholder={values.buyoceanfreightUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyoceanfreightJPY"
                          name="buyoceanfreightJPY"
                          value={values.buyoceanfreightJPY}
                          placeholder={values.buyoceanfreightJPY}
                          onChange={handleChange}
                        />
                      </td> */}
                      <td>
                        <Field
                          type="text"
                          id="selloceanfreightUSD"
                          name="selloceanfreightUSD"
                          value={values.selloceanfreightUSD}
                          placeholder={values.selloceanfreightUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="selloceanfreightJPY"
                          name="selloceanfreightJPY"
                          value={values.selloceanfreightJPY}
                          placeholder={values.selloceanfreightJPY}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="buyoceanfreightUSD">
                          Surr Charge :-
                        </label>
                      </td>
                      {/* <td>
                        <Field
                          type="text"
                          id="buySurrChargeUSD"
                          name="buySurrChargeUSD"
                          value={values.buySurrChargeUSD}
                          placeholder={values.buySurrChargeUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buySurrChargeJPY"
                          name="buySurrChargeJPY"
                          value={values.buySurrChargeJPY}
                          placeholder={values.buySurrChargeJPY}
                          onChange={handleChange}
                        />
                      </td> */}
                      <td>
                        <Field
                          type="text"
                          id="sellSurrChargeUSD"
                          name="sellSurrChargeUSD"
                          value={values.sellSurrChargeUSD}
                          placeholder={values.sellSurrChargeUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="sellSurrChargeJPY"
                          name="sellSurrChargeJPY"
                          value={values.sellSurrChargeJPY}
                          placeholder={values.sellSurrChargeJPY}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="buyoceanfreightUSD">
                          THC Origin :-
                        </label>
                      </td>
                      {/* <td>
                        <Field
                          type="text"
                          id="buyTHCOriginUSD"
                          name="buyTHCOriginUSD"
                          value={values.buyTHCOriginUSD}
                          placeholder={values.buyTHCOriginUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyTHCOriginJPY"
                          name="buyTHCOriginJPY"
                          value={values.buyTHCOriginJPY}
                          placeholder={values.buyTHCOriginJPY}
                          onChange={handleChange}
                        />
                      </td> */}
                      <td>
                        <Field
                          type="text"
                          id="sellTHCOriginUSD"
                          name="sellTHCOriginUSD"
                          value={values.sellTHCOriginUSD}
                          placeholder={values.sellTHCOriginUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="sellTHCOriginJPY"
                          name="sellTHCOriginJPY"
                          value={values.sellTHCOriginJPY}
                          placeholder={values.sellTHCOriginJPY}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="buyoceanfreightUSD">Seal :-</label>
                      </td>
                      {/* <td>
                        <Field
                          type="text"
                          id="buySealUSD"
                          name="buySealUSD"
                          value={values.buySealUSD}
                          placeholder={values.buySealUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buySealJPY"
                          name="buySealJPY"
                          value={values.buySealJPY}
                          placeholder={values.buySealJPY}
                          onChange={handleChange}
                        />
                      </td> */}
                      <td>
                        <Field
                          type="text"
                          id="sellSealUSD"
                          name="sellSealUSD"
                          value={values.sellSealUSD}
                          placeholder={values.sellSealUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="sellSealJPY"
                          name="sellSealJPY"
                          value={values.sellSealJPY}
                          placeholder={values.sellSealJPY}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="DOCFEE">DOC Fee :-</label>
                      </td>
                      {/* <td>
                        <Field
                          type="text"
                          id="buyDocFeeUSD"
                          name="buyDocFeeUSD"
                          value={values.buyDocFeeUSD}
                          placeholder={values.buyDocFeeUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyDocFeeJPY"
                          name="buyDocFeeJPY"
                          value={values.buyDocFeeJPY}
                          placeholder={values.buyDocFeeJPY}
                          onChange={handleChange}
                        />
                      </td> */}
                      <td>
                        <Field
                          type="text"
                          id="sellDocFeeUSD"
                          name="sellDocFeeUSD"
                          value={values.sellDocFeeUSD}
                          placeholder={values.sellDocFeeUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="sellDocFeeJPY"
                          name="sellDocFeeJPY"
                          value={values.sellDocFeeJPY}
                          placeholder={values.sellDocFeeJPY}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="Other">Other :-</label>
                      </td>
                      {/* <td>
                        <Field
                          type="text"
                          id="buyOtherUSD"
                          name="buyOtherUSD"
                          value={values.buyOtherUSD}
                          placeholder={values.buyOtherUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyOtherJPY"
                          name="buyOtherJPY"
                          value={values.buyOtherJPY}
                          placeholder={values.buyOtherJPY}
                          onChange={handleChange}
                        />
                      </td> */}
                      <td>
                        <Field
                          type="text"
                          id="sellOtherUSD"
                          name="sellOtherUSD"
                          value={values.sellOtherUSD}
                          placeholder={values.sellOtherUSD}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="sellOtherJPY"
                          name="sellOtherJPY"
                          value={values.sellOtherJPY}
                          placeholder={values.sellOtherJPY}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <tr>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ marginLeft: "20px" }}
                  >
                    Update
                  </Button>
                </tr>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
}

export default EditSellItem;
