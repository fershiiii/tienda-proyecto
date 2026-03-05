import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductoLista from "./components/ProductoLista";
import ProductoForm from "./components/ProductoForm";

import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import { isLoggedIn, setLoggedIn } from "./auth";

export default function App() {
  const logged = isLoggedIn();

  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "#f6f7fb" }}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
          <div className="container">
            <NavLink
              className="navbar-brand fw-bold d-flex align-items-center gap-2"
              to={logged ? "/" : "/login"}
            >
              <span style={{ fontSize: 18 }}>🏪</span>
              <span>Mi Tienda - "Billy Bendicion de Dios"</span>
              <span className="badge text-bg-primary ms-2">Beta</span>
            </NavLink>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#nav"
              aria-controls="nav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="nav">
              <div className="navbar-nav ms-auto gap-1">
                {/* Solo mostrar links si está logueado */}
                {logged && (
                  <>
                    <NavLink
                      to="/"
                      end
                      className={({ isActive }) =>
                        `nav-link px-3 rounded-3 ${isActive ? "active fw-semibold" : ""}`
                      }
                    >
                      Productos
                    </NavLink>

                    <NavLink
                      to="/agregar"
                      className={({ isActive }) =>
                        `nav-link px-3 rounded-3 ${isActive ? "active fw-semibold" : ""}`
                      }
                    >
                      Agregar producto
                    </NavLink>

                    <button
                      className="btn btn-outline-danger btn-sm ms-lg-2 mt-2 mt-lg-0"
                      onClick={() => {
                        setLoggedIn(false);
                        window.location.href = "/login";
                      }}
                    >
                      Salir
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="container py-4">
          <Routes>
            {/* Pública */}
            <Route path="/login" element={<Login />} />

            {/* Protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                      <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4 p-md-5">
                          <ProductoLista />
                        </div>
                      </div>

                      <div className="text-center text-muted small mt-3">
                        Hecho con React + Bootstrap + MongoDB
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/agregar"
              element={
                <ProtectedRoute>
                  <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                      <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4 p-md-5">
                          <ProductoForm />
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/editar/:id"
              element={
                <ProtectedRoute>
                  <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                      <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4 p-md-5">
                          <ProductoForm />
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Cualquier otra ruta manda a login */}
            <Route path="*" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
