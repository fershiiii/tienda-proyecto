import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Busca donde se usa axios y cámbialo a:
const API_URL = `${import.meta.env.VITE_API_URL}/api/productos`;

const ProductoLista = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await axios.get(API_URL);
      setProductos(response.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        cargarProductos(); // Recargar la lista
      } catch (error) {
        console.error("Error eliminando producto:", error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Lista de Productos</h2>
      {productos.length === 0 ? (
        <p>No hay productos. ¡Agrega tu primer producto!</p>
      ) : (
        <div className="row">
          {productos.map((producto) => (
            <div key={producto._id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <p className="card-text">
                    <strong>Precio compra:</strong> ${producto.precioCompra}
                    <br />
                    <strong>Margen:</strong> {producto.margen}%<br />
                    <strong className="text-success">
                      Precio venta: ${producto.precioVenta}
                    </strong>
                    <br />
                    <strong>Stock:</strong> {producto.stock}
                  </p>
                  <Link
                    to={`/editar/${producto._id}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminarProducto(producto._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductoLista;
