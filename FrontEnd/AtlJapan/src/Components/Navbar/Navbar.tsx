import "./Navbar.css";

function Navbar() {
  return (
    <nav>
      <div className="navbar-content">
        <a href="/">
          <img
            src="logo.png"
            alt="Logo"
            width="50px"
            height="50px"
            className="rotating-logo"
          />
        </a>
      </div>
      <h3 className="ATLLoginWord">ATL Login</h3>
    </nav>
  );
}

export default Navbar;
