// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLoggedIn } from "../auth";

export default function Login() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg("");

    // ⚠️ Candado simple (frontend). La clave viene de env.
    if (password !== import.meta.env.VITE_LOGIN_PASSWORD) {
      setMsg("Contraseña incorrecta.");
      return;
    }

    setLoggedIn(true);
    navigate("/", { replace: true });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h3 className="mb-1">🔒 Acceso</h3>
              <p className="text-muted mb-3">
                Solo para el dueño de la tienda.
              </p>

              {msg && <div className="alert alert-danger">{msg}</div>}

              <form onSubmit={onSubmit}>
                <label className="form-label">Contraseña</label>
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                />
                <button className="btn btn-primary w-100 mt-3">Entrar</button>
              </form>
            </div>
          </div>

          <div className="text-center text-muted small mt-3">
            Inventario privado
          </div>
        </div>
      </div>
    </div>
  );
}
