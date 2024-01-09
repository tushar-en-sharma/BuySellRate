import { useState, useEffect } from "react";
import NavbarDashboard from "../Navbar/NavbarDashboard";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(""); // Start with an empty string
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the username from localStorage when the component mounts
    const storedUsername = localStorage.getItem("Username");
    if (storedUsername) {
      setLoggedInUser(storedUsername);
    }
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm new password must match.");
      return;
    }

    // console.log(loggedInUser, currentPassword);

    try {
      const checkPasswordResponse = await fetch(
        `${BASE_URL}/api/Login/check-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: loggedInUser,
            password: currentPassword,
          }),
        }
      );

      if (!checkPasswordResponse.ok) {
        setError("Invalid current password");
        return;
      }

      const updatePasswordResponse = await fetch(
        `${BASE_URL}/api/Login/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: loggedInUser,
            password: newPassword,
          }),
        }
      );

      if (!updatePasswordResponse.ok) {
        setError("Password update failed");
        return;
      }

      // Password changed successfully
      console.log("Password changed successfully");
      alert("Password Changed Succesfully");

      // Clear form and error message
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setError("");
      navigate("/dashboard");
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred while changing the password");
    }
  };

  return (
    <>
      <NavbarDashboard />
      <div>
        <h2 className="RegistrationText">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="form1">
            <div>
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Change Password</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePasswordPage;
