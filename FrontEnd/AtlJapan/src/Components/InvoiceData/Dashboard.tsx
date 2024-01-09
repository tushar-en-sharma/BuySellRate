import React, { useState } from "react";
import NavbarDashboard from "../Navbar/NavbarDashboard";
import ShipmentContainerBooking from "./ShipmentContainer";
import ShipmentROROBooking from "./ShipmentRORO";
import SBTstockjobtype from "./StockJobType";
import "./mainview.css";
import { Right } from "react-bootstrap/lib/Media";
import Inspection from "./Inspection";
import Frieghtinvoice from "./FreightInvoice";
import Truckinginvoice from "./Trucking";

function NonameDashboard() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <NavbarDashboard />
      <h1 className="mainview">Invoice Data Dashboard</h1>
      <label
        style={{ paddingLeft: "10px", fontSize: "20px", fontFamily: "fantasy" }}
      >
        Select Booking Type:
        <select
          value={selectedOption}
          onChange={handleChange}
          style={{ paddingLeft: "15px", marginLeft: "10px" }}
        >
          <option value="">Select...</option>
          <option value="container">Container Booking</option>
          <option value="roro">RORO Booking</option>
          <option value="SBT">SBT Stock Job Type</option>
          <option value="SBTInspection">SBT Inspection</option>
          <option value="Frieghtinvoice">Frieght Invoice</option>
          <option value="Truckinginvoice">Trucking Invoice</option>
        </select>
      </label>
      {selectedOption === "container" && <ShipmentContainerBooking />}{" "}
      {selectedOption === "roro" && <ShipmentROROBooking />}{" "}
      {selectedOption === "SBT" && <SBTstockjobtype />}{" "}
      {selectedOption === "SBTInspection" && <Inspection />}{" "}
      {selectedOption === "Frieghtinvoice" && <Frieghtinvoice />}{" "}
      {selectedOption === "Truckinginvoice" && <Truckinginvoice />}{" "}
      {/* Render Maintest for Container Booking */}
      {/* You can add similar conditions for other booking types */}
    </>
  );
}

export default NonameDashboard;
