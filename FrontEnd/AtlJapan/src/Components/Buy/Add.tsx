import NavbarDashboard from "../Navbar/NavbarDashboard";
// import "./AddBuySellRate.css";
import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddBuy.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface FormValues {
  PortofLanding: string;
  PortofDischarge: string;
  ShippingCompany: string;
  ContainerSize: string;
  ValidityFrom: string;
  ValidityTo: string;
  ContractSpotType: string;
  BuyoceanfreightUSD: string;
  BuyoceanfreightJPY: string;
  // Add other field names and their types here
}

function AddBuyRate() {
  // ----------------------------------------
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

  const [portOptions, setPortOptions] = useState<string[]>([]);
  const [containerSizeOptions, setContainerSizeOptions] = useState<string[]>(
    []
  );
  const [shippingCompanyOptions, setShippingCompanyOptions] = useState<
    string[]
  >([]);
  const [contractSpotOptions, setContractSpotOptions] = useState<string[]>([]);

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
        alert(error);
        console.log(error);
      }
    }

    // Trigger the fetch
    fetchData();
  }, []);

  // ------------------------------------------

  const navigate = useNavigate();

  var x = localStorage.getItem("Name");
  const [Username, setUser] = useState(x);

  return (
    <>
      <NavbarDashboard />
      <h1 className="AddText"> Add Buy Rate :-</h1>
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
            USDRate: "1",
            JPYRate: "1",
            BuyoceanfreightUSD: "",
            BuyoceanfreightJPY: "",
            BuySurrChargeUSD: "",
            BuySurrChargeJPY: "",
            BuyTHCOriginUSD: "",
            BuyTHCOriginJPY: "",
            BuySealUSD: "",
            BuySealJPY: "",
            BuyDocFeeUSD: "",
            BuyDocFeeJPY: "",
            BuyOtherUSD: "",
            BuyOtherJPY: "",
            SelloceanfreightUSD: "0",
            SelloceanfreightJPY: "0",
            SellSurrChargeUSD: "0",
            SellSurrChargeJPY: "0",
            SellTHCOriginUSD: "0",
            SellTHCOriginJPY: "0",
            SellSealUSD: "0",
            SellSealJPY: "0",
            SellDocFeeUSD: "0",
            SellDocFeeJPY: "0",
            SellOtherUSD: "0",
            SellOtherJPY: "0",
            BuyTotalUSD: "0",
            BuyTotalJPY: "0",
            SellTotalUSD: "0",
            SellTotalJPY: "0",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.PortofLanding) {
              errors.PortofLanding = "Port of Loading is required";
            }
            if (!values.PortofDischarge) {
              errors.PortofDischarge = "Port of Discharge is required";
            }
            if (!values.ShippingCompany) {
              errors.ShippingCompany = "Shipping Company is required";
            }
            if (!values.ContainerSize) {
              errors.ContainerSize = "Container Size is required";
            }
            if (!values.ValidityTo) {
              errors.ValidityTo = "Validity is required";
            }
            if (!values.ContractSpotType) {
              errors.ContractSpotType = "Type is required";
            }

            // Add additional validation rules for other fields as needed
            return errors;
          }}
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 500));

            Object.keys(values).forEach((key) => {
              if (
                values[key] === "" &&
                key !== "PortofReciept" &&
                key !== "FinalPlaceDelivery"
              ) {
                values[key] = "0";
              }
              values[key] = String(values[key]);
            });

            values.BuyTotalUSD = (
              parseFloat(values.BuyoceanfreightUSD) +
              parseFloat(values.BuySurrChargeUSD) +
              parseFloat(values.BuyTHCOriginUSD) +
              parseFloat(values.BuySealUSD) +
              parseFloat(values.BuyDocFeeUSD) +
              parseFloat(values.BuyOtherUSD)
            ).toString();

            values.BuyTotalJPY = (
              parseFloat(values.BuyoceanfreightJPY) +
              parseFloat(values.BuySurrChargeJPY) +
              parseFloat(values.BuyTHCOriginJPY) +
              parseFloat(values.BuySealJPY) +
              parseFloat(values.BuyDocFeeJPY) +
              parseFloat(values.BuyOtherJPY)
            ).toString();

            // alert(JSON.stringify(values, null, 2));
            // console.log(JSON.stringify(values, null, 2));

            try {
              const response = await axios.post(
                `${BASE_URL}/api/BuySellRate`,
                {
                  POR: values.PortofReciept || "",
                  POL: values.PortofLanding,
                  POD: values.PortofDischarge,
                  FinalPlaceDelivery: values.FinalPlaceDelivery || "",
                  ShippingCompany: values.ShippingCompany,
                  ContainerSize: values.ContainerSize,
                  ContractSpotType: values.ContractSpotType,
                  ValidityFrom: values.ValidityFrom,
                  ValidityTo: values.ValidityTo,
                  USDRate: values.USDRate,
                  JPYRate: values.JPYRate,
                  BuyoceanfreightUSD: values.BuyoceanfreightUSD,
                  BuyoceanfreightJPY: values.BuyoceanfreightJPY,
                  BuySurrChargeUSD: values.BuySurrChargeUSD,
                  BuySurrChargeJPY: values.BuySurrChargeJPY,
                  BuyTHCOriginUSD: values.BuyTHCOriginUSD,
                  BuyTHCOriginJPY: values.BuyTHCOriginJPY,
                  BuySealUSD: values.BuySealUSD,
                  BuySealJPY: values.BuySealJPY,
                  BuyDocFeeUSD: values.BuyDocFeeUSD,
                  BuyDocFeeJPY: values.BuyDocFeeJPY,
                  BuyOtherUSD: values.BuyOtherUSD,
                  BuyOtherJPY: values.BuyOtherJPY,
                  buyTotalUSD: values.BuyTotalUSD,
                  buyTotalJPY: values.BuyTotalJPY,
                  SelloceanfreightUSD: values.SelloceanfreightUSD,
                  SelloceanfreightJPY: values.SelloceanfreightJPY,
                  SellSurrChargeUSD: values.SellSurrChargeUSD,
                  SellSurrChargeJPY: values.SellSurrChargeJPY,
                  SellTHCOriginUSD: values.SellTHCOriginUSD,
                  SellTHCOriginJPY: values.SellTHCOriginJPY,
                  SellSealUSD: values.SellSealUSD,
                  SellSealJPY: values.SellSealJPY,
                  SellDocFeeUSD: values.SellDocFeeUSD,
                  SellDocFeeJPY: values.SellDocFeeJPY,
                  SellOtherUSD: values.SellOtherUSD,
                  SellOtherJPY: values.SellOtherJPY,
                  sellTotalUSD: values.SellTotalUSD,
                  sellTotalJPY: values.SellTotalJPY,
                  createdBy: Username,
                }
              );
              alert("Successfully Added");
              navigate("/FindBuyRate");
            } catch (error) {
              console.error("FAILED TO ADD ITEMS:", error);
              alert(
                "Failed to Add Items , Please fill all the neccasary fields"
              );
            }
          }}
        >
          <Form>
            <table className="AddBuyRateTable">
              <tr>
                <td>
                  <label htmlFor="PortofReciept">Port of Receipt (POR):-</label>
                  <Field
                    as="select"
                    id="PortofReciept"
                    name="PortofReciept"
                    placeholder="POR"
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
                  <label htmlFor="PortofLanding" className="required">
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
                  <ErrorMessage
                    name="PortofLanding"
                    component="div"
                    className="error error-message"
                  />
                </td>
                <td>
                  <label htmlFor="PortofDischarge" className="required">
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
                  <ErrorMessage
                    name="PortofDischarge"
                    component="div"
                    className="error error-message"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="FinalPlaceDelivery">
                    Final Place Delivery:-
                  </label>
                  <Field
                    as="select"
                    id="FinalPlaceDelivery"
                    name="FinalPlaceDelivery"
                    placeholder="POL"
                  >
                    <option value="">Select a port</option>
                    {portOptions
                      .filter((port) => port !== null  && port !== "NULL")
                      .map((port, index) => (
                        <option key={index} value={port}>
                          {port}
                        </option>
                      ))}
                  </Field>
                </td>
                <td>
                  <label htmlFor="ShippingCompany" className="required">
                    Shipping Company:-
                  </label>
                  <Field
                    as="select"
                    id="ShippingCompany"
                    name="ShippingCompany"
                    placeholder="Company"
                  >
                    <option value="">Select a shipping company</option>
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
                  <ErrorMessage
                    name="ShippingCompany"
                    component="div"
                    className="error error-message"
                  />
                </td>
                <td>
                  {" "}
                  <label htmlFor="ContainerSize" className="required">
                    Container Size:-
                  </label>
                  <Field
                    as="select"
                    id="ContainerSize"
                    name="ContainerSize"
                    placeholder="Size"
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
                  <ErrorMessage
                    name="ContainerSize"
                    component="div"
                    className="error error-message"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="ContractSpotType" className="required">
                    Contract/Spot:-
                  </label>
                  <Field
                    as="select"
                    id="ContractSpotType"
                    name="ContractSpotType"
                    placeholder="Contract/Spot"
                  >
                    <option value="">Select contract or spot</option>
                    {contractSpotOptions
                      .filter((type) => type !== null && type !== "NULL")
                      .map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="ContractSpotType"
                    component="div"
                    className="error error-message"
                  />
                </td>
                <td>
                  <label htmlFor="Validity" className="required">
                    Validity:-
                  </label>
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
                  <ErrorMessage
                    name="ValidityTo"
                    component="div"
                    className="error error-message"
                  />
                </td>
              </tr>
            </table>
            <h3 style={{ paddingLeft: "10px" }}>Buy Rate :- </h3>
            <table className="AddBuyRateTable">
              <thead>
                <td>Name</td>
                <td> Rate ($)</td>
                <td> Rate (¥)</td>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="OceanFreight">Ocean Freight :-</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuyoceanfreightUSD"
                      name="BuyoceanfreightUSD"
                      placeholder="Enter USD rate"
                    />
                    <label htmlFor="BuyoceanfreightUSD">$</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuyoceanfreightJPY"
                      name="BuyoceanfreightJPY"
                      placeholder="Enter JPY rate"
                    />
                    <label htmlFor="BuyoceanfreightJPY">¥</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="SurrCharge">Surr Charge :-</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuySurrChargeUSD"
                      name="BuySurrChargeUSD"
                      placeholder="Enter USD rate"
                    />
                    <label htmlFor="BuySurrChargeUSD">$</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuySurrChargeJPY"
                      name="BuySurrChargeJPY"
                      placeholder="Enter JPY rate"
                    />
                    <label htmlFor="BuySurrChargeJPY">¥</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="THCOrigin">THC Origin:-</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuyTHCOriginUSD"
                      name="BuyTHCOriginUSD"
                      placeholder="Enter USD rate"
                    />
                    <label htmlFor="BuySurrChargeUSD">$</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuyTHCOriginJPY"
                      name="BuyTHCOriginJPY"
                      placeholder="Enter JPY rate"
                    />
                    <label htmlFor="BuySurrChargeJPY">¥</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="Seal">Seal :-</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuySealUSD"
                      name="BuySealUSD"
                      placeholder="Enter USD rate"
                    />
                    <label htmlFor="BuySealUSD">$</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuySealJPY"
                      name="BuySealJPY"
                      placeholder="Enter JPY rate"
                    />
                    <label htmlFor="BuySealJPY">¥</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="DocFee">DOC FEE :-</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuyDocFeeUSD"
                      name="BuyDocFeeUSD"
                      placeholder="Enter USD rate"
                    />
                    <label htmlFor="BuyDocFeeUSD">$</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuyDocFeeJPY"
                      name="BuyDocFeeJPY"
                      placeholder="Enter JPY rate"
                    />
                    <label htmlFor="BuyDocFeeJPY">¥</label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="Other">Other :-</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuyOtherUSD"
                      name="BuyOtherUSD"
                      placeholder="Enter USD rate"
                    />
                    <label htmlFor="BuyOtherUSD">$</label>
                  </td>
                  <td>
                    <Field
                      type="number"
                      id="BuyOtherJPY"
                      name="BuyOtherJPY"
                      placeholder="Enter JPY rate"
                    />
                    <label htmlFor="BuyOtherJPY">¥</label>
                  </td>
                </tr>
              </tbody>
            </table>
            <tr>
              <button type="submit">Submit</button>
            </tr>
          </Form>
        </Formik>
      </div>
    </>
  );
}

export default AddBuyRate;
