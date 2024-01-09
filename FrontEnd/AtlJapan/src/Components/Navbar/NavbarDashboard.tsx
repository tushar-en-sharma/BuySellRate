import React, { Component } from "react";
import UserIcon from "./UserIcon";
import "./NavbarDashboard.css";

class NavbarDashboard extends Component {
  state = {
    clicked: false,
    showBuySellDropdown: false,
    showLogoutDropdown: false,
  };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  toggleBuySellDropdown = () => {
    this.setState({ showBuySellDropdown: !this.state.showBuySellDropdown });
  };

  toggleLogoutDropdown = () => {
    this.setState({ showLogoutDropdown: !this.state.showLogoutDropdown });
  };

  render() {
    // Retrieve user name from local storage
    const userName = localStorage.getItem("Name");

    // Define the allowed user names
    const allowedUserNames = ["Admin User", "Rahul Kaushik", "Saurabh Endley"];

    return (
      <nav className={this.state.clicked ? "active" : ""}>
        <a href="/dashboard">
          <img src="logo.png" alt="Logo" className="rotating-logo" />
        </a>
        <div id="mobile" onClick={this.handleClick}>
          <i
            className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}
          ></i>
        </div>
        <ul id="navbar" className={this.state.clicked ? "active" : ""}>
          {userName && allowedUserNames.includes(userName) && (
            <li>
              <a href="/InvoiceData">InvoiceData</a>
            </li>
          )}
          <li>
            <div className="dropdown" onClick={this.toggleBuySellDropdown}>
              <a className="active">Buy</a>
              {this.state.showBuySellDropdown && (
                <div className="dropdown-content">
                  <a href="/DashboardBuy">Dashboard</a>
                  <a href="/AddBuyRate">Add</a>
                  <a href="/FindBuyRate">Find</a>
                </div>
              )}
            </div>
          </li>
          <li>
            <div className="dropdown" onClick={this.toggleBuySellDropdown}>
              <a className="active">Sell</a>
              {this.state.showBuySellDropdown && (
                <div className="dropdown-content">
                  <a href="/DashboardSell">Dashboard</a>
                  <a href="/AddSellRate">Add</a>
                  <a href="/FindSellRate">Find</a>
                </div>
              )}
            </div>
          </li>
          <li>
            <a href="/UserRegistration">Add User</a>
          </li>
          {/* Add more menu items as needed */}
          <li>
            <div className="dropdown1" onClick={this.toggleLogoutDropdown}>
              <UserIcon />
              {this.state.showLogoutDropdown && (
                <div className="dropdown-content">
                  <a href="/ChangePassword">Change Password</a>
                  <a href="/">Logout</a>
                  {/* Add more dropdown items as needed */}
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavbarDashboard;
