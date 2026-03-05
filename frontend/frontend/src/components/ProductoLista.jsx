import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/productos`;

const ORDEN_CATEGORIAS = [
  "Abarrotes",
  "Bebidas",
  "Lácteos y Huevos",
  "Panadería",
  "Limpieza del Hogar",
  "Higiene Personal",
  "Papelería",
  "Mascotas",
  "Desechables",
  "Otros",
  "Sin categoría",
];

export default function ProductoLista() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Abarrotes");

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(API_URL);
      const data = Array.isArray(res.data) ? res.data : [];
      setProductos(data);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los productos.");
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id, nombre) => {
    const ok = window.confirm(`¿Eliminar "${nombre}"?`);
    if (!ok) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      await cargarProductos();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar el producto.");
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const categoriasConProductos = useMemo(() => {
    const set = new Set(
      productos.map(
        (p) => (p.categoria || "Sin categoría").trim() || "Sin categoría",
      ),
    );

    // Mantener orden “de tienda” y luego las que aparezcan extra
    const ordered = ORDEN_CATEGORIAS.filter((c) => set.has(c));
    const extras = Array.from(set)
      .filter((c) => !ORDEN_CATEGORIAS.includes(c))
      .sort();
    return [...ordered, ...extras];
  }, [productos]);

  // Si la tab actual ya no existe (por ejemplo estaba vacía), selecciona la primera disponible
  useEffect(() => {
    if (categoriasConProductos.length === 0) return;
    if (!categoriasConProductos.includes(tab)) {
      setTab(categoriasConProductos[0]);
    }
  }, [categoriasConProductos, tab]);

  const productosDeTab = useMemo(() => {
    const cat = tab || "Sin categoría";
    return productos.filter(
      (p) =>
        ((p.categoria || "Sin categoría").trim() || "Sin categoría") === cat,
    );
  }, [productos, tab]);

  const totalStockTab = useMemo(() => {
    return productosDeTab.reduce((acc, p) => acc + Number(p.stock ?? 0), 0);
  }, [productosDeTab]);

  if (loading)
    return <div className="text-muted">⏳ Cargando productos...</div>;
  if (error) return <div className="alert alert-danger mb-0">{error}</div>;

  if (productos.length === 0) {
    return (
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0">Productos</h2>
          <Link to="/agregar" className="btn btn-primary">
            + Agregar
          </Link>
        </div>
        <div className="alert alert-info mb-0">
          No hay productos aún. Crea el primero con <b>Agregar</b>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Productos</h2>
          <div className="text-muted small">
            Total productos: <b>{productos.length}</b>
          </div>
        </div>

        <Link to="/agregar" className="btn btn-primary">
          + Agregar
        </Link>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills flex-wrap gap-2 mb-3">
        {categoriasConProductos.map((c) => {
          const count = productos.filter(
            (p) =>
              ((p.categoria || "Sin categoría").trim() || "Sin categoría") ===
              c,
          ).length;

          return (
            <li className="nav-item" key={c}>
              <button
                className={`nav-link ${tab === c ? "active" : ""}`}
                onClick={() => setTab(c)}
                type="button"
              >
                {c} <span className="ms-1 opacity-75">({count})</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Resumen de categoría */}
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
        <div className="text-muted">
          Categoría: <b>{tab}</b> — Productos: <b>{productosDeTab.length}</b> —
          Stock total: <b>{totalStockTab}</b>
        </div>
      </div>

      {/* Tabla */}
      {productosDeTab.length === 0 ? (
        <div className="alert alert-warning mb-0">
          No hay productos en <b>{tab}</b>.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th className="text-end">Compra ($)</th>
                <th className="text-end">Margen (%)</th>
                <th className="text-end">Venta ($)</th>
                <th className="text-center">Stock</th>
                <th className="text-end" style={{ width: 220 }}>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {productosDeTab.map((p) => {
                const stock = Number(p.stock ?? 0);

                return (
                  <tr key={p._id}>
                    <td>
                      <div className="fw-semibold">{p.nombre}</div>
                      <div className="text-muted small">
                        ID: {String(p._id).slice(0, 8)}...
                      </div>
                    </td>

                    <td className="text-end">
                      {Number(p.precioCompra ?? 0).toFixed(2)}
                    </td>
                    <td className="text-end">{Number(p.margen ?? 0)}</td>
                    <td className="text-end fw-semibold">
                      {Number(p.precioVenta ?? 0).toFixed(2)}
                    </td>

                    <td className="text-center">
                      <span
                        className={`badge ${
                          stock <= 0
                            ? "text-bg-danger"
                            : stock <= 5
                              ? "text-bg-warning"
                              : "text-bg-success"
                        }`}
                      >
                        {stock}
                      </span>
                    </td>

                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Link
                          to={`/editar/${p._id}`}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Editar
                        </Link>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => eliminarProducto(p._id, p.nombre)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="text-muted small">
            Tip: cambia de pestaña para ver cada categoría “aparte”.
          </div>
        </div>
      )}
    </div>
  );
}
