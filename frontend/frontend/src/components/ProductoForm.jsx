import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/productos`;

const ProductoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: "",
    precioCompra: "",
    margen: "30",
    stock: "0",
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (id) {
      cargarProducto();
    }
  }, [id]);

  const cargarProducto = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setProducto(response.data);
    } catch (error) {
      console.error("Error cargando producto:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, precioCompra, margen, stock } = producto;

    if (!nombre || !precioCompra || !margen) {
      setErrorMsg("Por favor, completa todos los campos obligatorios");
      return;
    }

    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, producto);
      } else {
        await axios.post(API_URL, producto);
      }
      navigate("/");
    } catch (error) {
      setErrorMsg("Error guardando el producto");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>{id ? "Editar Producto" : "Agregar Producto"}</h2>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre del Producto *</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={producto.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Camisa, Pantalón, etc."
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Precio de Compra ($) *</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="precioCompra"
              value={producto.precioCompra}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Margen de Ganancia (%) *</label>
            <input
              type="number"
              className="form-control"
              name="margen"
              value={producto.margen}
              onChange={handleInputChange}
              placeholder="30"
            />
            <small className="text-muted">
              El precio de venta se calculará automáticamente
            </small>
          </div>

          <div className="mb-3">
            <label className="form-label">Stock Inicial</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={producto.stock}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn btn-success">
            {id ? "Actualizar" : "Guardar"} Producto
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>
        </form>

        {!id && (
          <div className="alert alert-info mt-3">
            <strong>Vista previa:</strong> Precio de venta sugerido: $
            {producto.precioCompra && producto.margen
              ? (producto.precioCompra * (1 + producto.margen / 100)).toFixed(2)
              : "0.00"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoForm;
