import { Link } from "react-router-dom";

function NavLogin() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold fs-4 text-white" to="/">
          🚲 MJBE Bikes
        </Link>
        <div className="d-flex align-items-center text-white-50">
          Portal seguro
        </div>
      </div>
    </nav>
  );
}

export default NavLogin;
