import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./Components/LoginPage/LoginPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import UserRegistration from "./Components/Registration/UserRegistration";
import AddBuyRate from "./Components/Buy/Add";
import FindBuyRate from "./Components/Buy/Find";
import AddSellRate from "./Components/Sell/Add";
import AllocateSellRate from "./Components/Sell/Find";
import SuccessRegistration from "./Components/Registration/Successfull";
import EditBuyRate from "./Components/Buy/Edit";
import DetailsPerItem from "./Components/Buy/DetailPerItem";
import AddItemDetails from "./Components/Sell/AddItem";
import AllDetailsPerItem from "./Components/Sell/DetailViewItem";
import SellDetailsPerItem from "./Components/Sell/SellDetailsPerItem";
import EditSellItem from "./Components/Sell/EditSellRate";
import DashboardBuy from "./Components/Buy/Dashboard";
import DashboardSell from "./Components/Sell/Dashboard";
import ChangePasswordPage from "./Components/Registration/ChangePassword";
// import Maintest from "./Components/TestView/ShipmetnContainer";
import Nonamedashboard from "./Components/InvoiceData/Dashboard";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* <Route index element={<App />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Login and Registration */}
        <Route path="/" element={<Loginpage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/UserRegistration" element={<UserRegistration />} />
        <Route path="/SuccessRegistration" element={<SuccessRegistration />} />
        <Route path="/ChangePassword" element={<ChangePasswordPage />} />
        {/* Buying Rate */}
        <Route path="/DashboardBuy" element={<DashboardBuy />} />
        <Route path="/FindBuyRate" element={<FindBuyRate />} />
        <Route path="/AddBuyRate" element={<AddBuyRate />} />
        <Route path="/EditItem/:id" element={<EditBuyRate />} />
        <Route path="/AddBuyRate" element={<AddBuyRate />} />
        <Route path="/FindBuyRate" element={<FindBuyRate />} />
        <Route path="/DetailItem/:id" element={<DetailsPerItem />} />
        {/* Sell Rate */}
        <Route path="/AddSellRate" element={<AddSellRate />} />
        <Route path="/FindSellRate" element={<AllocateSellRate />} />
        <Route path="/AddSellRate" element={<AddSellRate />} />
        <Route path="/AllocateSellRate" element={<AllocateSellRate />} />
        <Route path="/AddSellDetails/:id" element={<AddItemDetails />} />
        <Route path="/SellItem/:values" element={<AllDetailsPerItem />} />
        <Route path="/SellItemDetail/:id" element={<SellDetailsPerItem />} />
        <Route path="/EditSellItem/:id" element={<EditSellItem />} />
        <Route path="/DashboardSell" element={<DashboardSell />} />
        {/* Test View */}
        <Route path="/InvoiceData" element={<Nonamedashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
