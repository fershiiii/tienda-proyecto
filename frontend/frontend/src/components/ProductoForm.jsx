import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/productos`;

const CATEGORIAS_BASE = [
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
];

export default function ProductoForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // si existe => editar

  const [nombre, setNombre] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [margen, setMargen] = useState(30);
  const [stock, setStock] = useState(0);

  // categorías
  const [categoria, setCategoria] = useState("General");
  const [categoriaCustom, setCategoriaCustom] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const precioVentaPreview = useMemo(() => {
    const pc = Number(precioCompra);
    const m = Number(margen);
    if (Number.isNaN(pc) || pc <= 0) return 0;
    if (Number.isNaN(m) || m < 0) return 0;
    return Math.round(pc * (1 + m / 100) * 100) / 100;
  }, [precioCompra, margen]);

  const categoriaFinal = useMemo(() => {
    const c = categoria === "__custom__" ? categoriaCustom : categoria;
    const clean = (c || "").trim();
    return clean.length ? clean : "Sin categoría";
  }, [categoria, categoriaCustom]);

  // Cargar producto si estamos editando
  useEffect(() => {
    const cargar = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setMsg("");

        const res = await axios.get(`${API_URL}/${id}`);
        const p = res.data;

        setNombre(p.nombre ?? "");
        setPrecioCompra(String(p.precioCompra ?? ""));
        setMargen(Number(p.margen ?? 30));
        setStock(Number(p.stock ?? 0));

        const cat = (p.categoria || "Sin categoría").trim();
        // si viene en base, lo selecciona; si no, lo pone como custom
        if (CATEGORIAS_BASE.includes(cat) || cat === "Sin categoría") {
          setCategoria(cat === "Sin categoría" ? "General" : cat);
          setCategoriaCustom("");
        } else {
          setCategoria("__custom__");
          setCategoriaCustom(cat);
        }
      } catch (e) {
        console.error(e);
        setMsg("❌ No se pudo cargar el producto para editar.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!nombre.trim()) return setMsg("⚠️ Escribe el nombre del producto.");
    if (precioCompra === "" || Number(precioCompra) < 0)
      return setMsg("⚠️ Precio de compra inválido.");
    if (Number(margen) < 0) return setMsg("⚠️ Margen inválido.");
    if (Number(stock) < 0) return setMsg("⚠️ Stock inválido.");

    try {
      setSaving(true);

      const payload = {
        nombre: nombre.trim(),
        categoria: categoriaFinal,
        precioCompra: Number(precioCompra),
        margen: Number(margen),
        stock: Number(stock),
      };

      if (id) {
        await axios.put(`${API_URL}/${id}`, payload);
        setMsg("✅ Producto actualizado.");
      } else {
        await axios.post(API_URL, payload);
        setMsg("✅ Producto creado.");
      }

      setTimeout(() => navigate("/"), 500);
    } catch (e) {
      console.error(e);
      setMsg("❌ No se pudo guardar. Revisa la consola.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-muted">Cargando producto...</div>;
  }

  return (
    <div>
      <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h2 className="mb-1">
            {id ? "Editar producto" : "Agregar producto"}
          </h2>
          <div className="text-muted">
            Selecciona una categoría para mantener todo ordenado.
          </div>
        </div>
        <div className="badge text-bg-primary">
          Vista previa: ${precioVentaPreview.toFixed(2)}
        </div>
      </div>

      {msg && (
        <div
          className={`alert ${
            msg.startsWith("✅")
              ? "alert-success"
              : msg.startsWith("⚠️")
                ? "alert-warning"
                : "alert-danger"
          }`}
        >
          {msg}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Nombre *</label>
            <input
              className="form-control form-control-lg"
              placeholder="Ej: Camisa, Pantalón..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {CATEGORIAS_BASE.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__custom__">+ Nueva categoría...</option>
            </select>

            {categoria === "__custom__" && (
              <div className="mt-2">
                <input
                  className="form-control"
                  placeholder="Ej: Papelería, Accesorios..."
                  value={categoriaCustom}
                  onChange={(e) => setCategoriaCustom(e.target.value)}
                />
                <div className="form-text">
                  Se guardará como una categoría nueva.
                </div>
              </div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Stock</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Precio compra ($) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Margen (%)</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={margen}
              onChange={(e) => setMargen(e.target.value)}
            />
            <div className="form-text">
              El precio de venta se calcula automáticamente.
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-4">
          <button className="btn btn-primary px-4" disabled={saving}>
            {saving
              ? "Guardando..."
              : id
                ? "Guardar cambios"
                : "Guardar producto"}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/")}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
