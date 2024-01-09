import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import Button from "@mui/material/Button";
import NavbarDashboard from "../Navbar/NavbarDashboard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define an interface for the expected shape of currentValues
interface CurrentValues {
  customer: any;
  por: string;
  pol: string;
  pod: string;
  finalPlaceDelivery: string;
  shippingCompany: string;
  containerSize: string;
  contractSpotType: string;
  validityTo: string;
  validityFrom: string;
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
  quotationNumber: string;
  // Add other fields here
}

function SellDetailsItems() {
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
        const response = await axios.get(`${BASE_URL}/api/SellRate/${id}`);
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
    try {
      try {
        // Buy Rate Conversion Logic ----------------------------------------------
        values.buyoceanfreightJPY = (
          parseFloat(values.buyoceanfreightUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.buyoceanfreightJPY = parseInt(
          values.buyoceanfreightJPY
        ).toString();
        values.buySurrChargeJPY = (
          parseFloat(values.buySurrChargeUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.buySurrChargeJPY = parseInt(values.buySurrChargeJPY).toString();
        values.buyTHCOriginJPY = (
          parseFloat(values.buyTHCOriginUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.buyTHCOriginJPY = parseInt(values.buyTHCOriginJPY).toString();
        values.buySealJPY = (
          parseFloat(values.buySealUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.buySealJPY = parseInt(values.buySealJPY).toString();
        values.buyDocFeeJPY = (
          parseFloat(values.buyDocFeeUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.buyDocFeeJPY = parseInt(values.buyDocFeeJPY).toString();
        values.buyOtherJPY = (
          parseFloat(values.buyOtherUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.buyOtherJPY = parseInt(values.buyOtherJPY).toString();

        // -----------------------------------------------------------------------------
        // Sell Rate Conversion Logic --------------------------------------------
        values.selloceanfreightJPY = (
          parseFloat(values.selloceanfreightUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.sellSurrChargeJPY = (
          parseFloat(values.sellSurrChargeUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.sellTHCOriginJPY = (
          parseFloat(values.sellTHCOriginUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.sellSealJPY = (
          parseFloat(values.sellSealUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.sellDocFeeJPY = (
          parseFloat(values.sellDocFeeUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.sellOtherJPY = (
          parseFloat(values.sellOtherUSD) * parseFloat(values.jpyRate)
        ).toString();
        values.selloceanfreightJPY = parseInt(
          values.selloceanfreightJPY
        ).toString();
        values.sellSurrChargeJPY = parseInt(
          values.sellSurrChargeJPY
        ).toString();
        values.sellTHCOriginJPY = parseInt(values.sellTHCOriginJPY).toString();
        values.sellSealJPY = parseInt(values.sellSealJPY).toString();
        values.sellDocFeeJPY = parseInt(values.sellDocFeeJPY).toString();
        values.sellOtherJPY = parseInt(values.sellOtherJPY).toString();
        // ---------------------------------------------------------------------

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
      } catch (error) {
        alert("Failed to Convert into JPY Update ");
      }

      // alert(JSON.stringify(values, null, 2));
      // console.log(JSON.stringify(values, null, 2));
      // await axios.put(`http://localhost:5291/api/SellRate/${id}`, values);
      // alert("Data updated successfully");
      // navigate("/RateDashboard");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data. Please try again.");
    }
  };

  return (
    <>
      <NavbarDashboard />
      <div>
        <h2 className="Dashboard-text">Details</h2>
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
                      {masterTableData.map((entry: any) => (
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
                      {masterTableData.map((entry: any) => (
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
                        .filter((company: any) => company !== null)
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
                      disabled={true}
                    >
                      <option value="">Select a port</option>
                      {masterTableData.map((entry: any) => (
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
                      disabled={true}
                    >
                      <option value="">Select a port</option>
                      {masterTableData.map((entry: any) => (
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
                      disabled={true}
                    >
                      <option value="">Select a Size</option>
                      {masterTableData
                        .map((entry: any) => entry.ContainerSize)
                        .filter((size: any) => size !== null)
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
                      disabled={true}
                    >
                      <option value="">Select Contract or Spot</option>
                      {masterTableData
                        .map((entry: any) => entry.ContractSpotType)
                        .filter((type: any) => type !== null)
                        .map((type: any, index: number) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                    </Field>
                  </td>
                  <td>
                    <label htmlFor="usdRate">Validity:</label>
                    {new Date(values.validityFrom).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}{" "}
                    TO{" "}
                    {new Date(values.validityTo).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <label htmlFor="Customer">Customer:</label>
                    <Field
                      as="select"
                      id="Customer"
                      name="Customer"
                      value={values.customer}
                      onChange={handleChange}
                      disabled={true}
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
                    <label htmlFor="QuotationNumber">Quotation Number:</label>
                    <Field
                      as="text"
                      id="QuotationNumber"
                      name="QuotationNumber"
                      value={values.quotationNumber}
                      onChange={handleChange}
                      disabled={true}
                    ></Field>
                  </td>
                </tr>

                <table className="ViewRate">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Buy Rate ($)</th>
                      <th>Buy Rate (¥)</th>
                      <th>Sell Rate ($)</th>
                      <th>Sell Rate (¥)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      Ocean Freight :
                      <td>
                        <Field
                          type="text"
                          value={values.buyoceanfreightUSD}
                          placeholder={values.buyoceanfreightUSD}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          value={values.buyoceanfreightJPY}
                          placeholder={values.buyoceanfreightJPY}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          value={values.selloceanfreightUSD}
                          placeholder={values.selloceanfreightUSD}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          value={values.selloceanfreightJPY}
                          placeholder={values.selloceanfreightJPY}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                    </tr>
                    <tr>
                      Surr Charge :
                      <td>
                        <Field
                          type="text"
                          id="buySurrChargeUSD"
                          name="buySurrChargeUSD"
                          value={values.buySurrChargeUSD}
                          placeholder={values.buySurrChargeUSD}
                          onChange={handleChange}
                          disabled={true}
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
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buySurrChargeUSD"
                          name="buySurrChargeUSD"
                          value={values.sellSurrChargeUSD}
                          placeholder={values.sellSurrChargeUSD}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buySurrChargeJPY"
                          name="buySurrChargeJPY"
                          value={values.sellSurrChargeJPY}
                          placeholder={values.sellSurrChargeJPY}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                    </tr>
                    <tr>
                      THC Origin :
                      <td>
                        <Field
                          type="text"
                          id="buyTHCOriginUSD"
                          name="buyTHCOriginUSD"
                          value={values.buyTHCOriginUSD}
                          placeholder={values.buyTHCOriginUSD}
                          onChange={handleChange}
                          disabled={true}
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
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyTHCOriginUSD"
                          name="buyTHCOriginUSD"
                          value={values.sellTHCOriginUSD}
                          placeholder={values.sellTHCOriginUSD}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyTHCOriginJPY"
                          name="buyTHCOriginJPY"
                          value={values.sellTHCOriginJPY}
                          placeholder={values.sellTHCOriginJPY}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                    </tr>
                    <tr>
                      Seal:
                      <td>
                        <Field
                          type="text"
                          id="buySealUSD"
                          name="buySealUSD"
                          value={values.buySealUSD}
                          placeholder={values.buySealUSD}
                          onChange={handleChange}
                          disabled={true}
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
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buySealUSD"
                          name="buySealUSD"
                          value={values.sellSealUSD}
                          placeholder={values.sellSealUSD}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buySealJPY"
                          name="buySealJPY"
                          value={values.sellSealJPY}
                          placeholder={values.sellSealJPY}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                    </tr>
                    <tr>
                      DOC Fee :
                      <td>
                        <Field
                          type="text"
                          id="buyDocFeeUSD"
                          name="buyDocFeeUSD"
                          value={values.buyDocFeeUSD}
                          placeholder={values.buyDocFeeUSD}
                          onChange={handleChange}
                          disabled={true}
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
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyDocFeeUSD"
                          name="buyDocFeeUSD"
                          value={values.sellDocFeeUSD}
                          placeholder={values.sellDocFeeUSD}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyDocFeeJPY"
                          name="buyDocFeeJPY"
                          value={values.sellDocFeeJPY}
                          placeholder={values.sellDocFeeJPY}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                    </tr>
                    <tr>
                      Other :
                      <td>
                        <Field
                          type="text"
                          id="buyOtherUSD"
                          name="buyOtherUSD"
                          value={values.buyOtherUSD}
                          placeholder={values.buyOtherUSD}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyOtherUSD"
                          name="buyOtherUSD"
                          value={values.buyOtherJPY}
                          placeholder={values.buyOtherJPY}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyOtherUSD"
                          name="buyOtherUSD"
                          value={values.sellOtherUSD}
                          placeholder={values.sellOtherUSD}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyOtherUSD"
                          name="buyOtherUSD"
                          value={values.sellOtherJPY}
                          placeholder={values.sellOtherJPY}
                          onChange={handleChange}
                          disabled={true}
                        />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>TOTAL</td>
                      <td>
                        <Field
                          type="text"
                          id="buyTotalUSD"
                          name="buyTotalUSD"
                          value={values.buyTotalUSD}
                          placeholder={values.buyTotalUSD}
                          onChange={handleChange}
                          disabled={true}
                        />{" "}
                        $
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyTotalJPY"
                          name="buyTotalJPY"
                          value={values.buyTotalJPY}
                          placeholder={values.buyTotalJPY}
                          onChange={handleChange}
                          disabled={true}
                        />{" "}
                        ¥
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyTotalUSD"
                          name="buyTotalUSD"
                          value={values.sellTotalUSD}
                          placeholder={values.sellTotalUSD}
                          onChange={handleChange}
                          disabled={true}
                        />{" "}
                        $
                      </td>
                      <td>
                        <Field
                          type="text"
                          id="buyTotalJPY"
                          name="buyTotalJPY"
                          value={values.sellTotalJPY}
                          placeholder={values.sellTotalJPY}
                          onChange={handleChange}
                          disabled={true}
                        />{" "}
                        ¥
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
}

export default SellDetailsItems;
