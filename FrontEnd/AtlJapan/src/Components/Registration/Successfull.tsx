import NavbarDashboard from "../Navbar/NavbarDashboard";
import "../Dashboard/Dashboard.css";

function SuccessRegistration() {
  return (
    <>
      <NavbarDashboard />,
      <div className="home">
        <p>
          <h1>Successfully Added User</h1>
        </p>
      </div>
    </>
  );
}

export default SuccessRegistration;
