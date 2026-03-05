import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span style={{ fontSize: 18 }}>🏪</span>
          <span className="fw-bold">Mi Tienda</span>
          <span className="badge-soft ms-2">Beta</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link" to="/" end>
              Productos
            </NavLink>
            <NavLink className="nav-link" to="/nuevo">
              Agregar producto
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
