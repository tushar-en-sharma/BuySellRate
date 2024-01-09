import { useState } from "react";
import axios from "axios";
import NavbarDashboard from "../Navbar/NavbarDashboard";
import { useNavigate } from "react-router-dom";
import "./UserRegistration.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Validation
    if (!firstName || !lastName || !username || !password) {
      alert("All fields are mandatory");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/Registration`, {
        username,
        password,
        Name: `${firstName} ${lastName}`,
      });
      navigate("/SuccessRegistration");
      // Registration successful; you can handle the response as needed.
    } catch (error) {
      alert("Registration failed");
      console.error("Registration failed:", error);
    }
  };

  return (
    <>
      <NavbarDashboard />
      <h2 className="RegistrationText">Registration</h2>
      <div className="form1">
        <form onSubmit={handleRegistration}>
          <div>
            <label style={{ paddingRight: "10px" }}>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ paddingRight: "10px" }}>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ paddingRight: "10px" }}>Email:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ paddingRight: "10px" }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="PasswordInput"
              style={{ width: "60%", height: "40%" }}
              required
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Registration;
