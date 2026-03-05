import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductoLista from "./components/ProductoLista";
import ProductoForm from "./components/ProductoForm";

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              🏪 Mi Tienda
            </Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">
                Productos
              </Link>
              <Link className="nav-link" to="/agregar">
                Agregar Producto
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ProductoLista />} />
          <Route path="/agregar" element={<ProductoForm />} />
          <Route path="/editar/:id" element={<ProductoForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
