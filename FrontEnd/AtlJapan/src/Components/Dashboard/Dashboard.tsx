import NavbarDashboard from "../Navbar/NavbarDashboard";
import "./Dashboard.css";

function Dashboard() {
  return (
    <>
      <NavbarDashboard />,
      <div className="home">
        <p>Welcome to your Dashboard</p>
      </div>
    </>
  );
}

export default Dashboard;
