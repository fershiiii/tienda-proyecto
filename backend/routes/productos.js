const express = require("express");
const router = express.Router();

function isValidObjectId(ObjectId, id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// Obtener todos los productos
router.get("/", async (req, res, next) => {
  try {
    const productos = await req.context.collections.productos
      .find({})
      .toArray();
    res.json(productos);
  } catch (error) {
    next(error);
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ObjectId } = req.context;

    if (!isValidObjectId(ObjectId, id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const producto = await req.context.collections.productos.findOne({
      _id: new ObjectId(id),
    });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo producto
router.post("/", async (req, res, next) => {
  try {
    const { nombre, precioCompra, margen } = req.body;

    if (!nombre || precioCompra === undefined) {
      return res
        .status(400)
        .json({ mensaje: "nombre y precioCompra son requeridos" });
    }

    const pc = Number(precioCompra);
    if (Number.isNaN(pc) || pc < 0) {
      return res
        .status(400)
        .json({ mensaje: "precioCompra debe ser un número válido" });
    }

    const m = margen === undefined ? 30 : Number(margen);
    if (Number.isNaN(m) || m < 0) {
      return res
        .status(400)
        .json({ mensaje: "margen debe ser un número válido" });
    }

    const precioVenta = pc * (1 + m / 100);

    const nuevoProducto = {
      nombre: String(nombre).trim(),
      precioCompra: pc,
      margen: m,
      precioVenta: round2(precioVenta),
      fechaCreacion: new Date(),
      stock: 0,
    };

    const result =
      await req.context.collections.productos.insertOne(nuevoProducto);

    res.status(201).json({
      ...nuevoProducto,
      _id: result.insertedId,
    });
  } catch (error) {
    next(error);
  }
});

// Actualizar un producto (permite update parcial)
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ObjectId } = req.context;

    if (!isValidObjectId(ObjectId, id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const { nombre, precioCompra, margen, stock } = req.body;

    // Buscar producto actual para poder recalcular sin NaN
    const actual = await req.context.collections.productos.findOne({
      _id: new ObjectId(id),
    });

    if (!actual) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const pc =
      precioCompra !== undefined ? Number(precioCompra) : actual.precioCompra;
    if (Number.isNaN(pc) || pc < 0) {
      return res
        .status(400)
        .json({ mensaje: "precioCompra debe ser un número válido" });
    }

    const m = margen !== undefined ? Number(margen) : actual.margen;
    if (Number.isNaN(m) || m < 0) {
      return res
        .status(400)
        .json({ mensaje: "margen debe ser un número válido" });
    }

    const st = stock !== undefined ? Number(stock) : (actual.stock ?? 0);
    if (Number.isNaN(st) || st < 0) {
      return res
        .status(400)
        .json({ mensaje: "stock debe ser un número válido" });
    }

    const precioVenta = pc * (1 + m / 100);

    const updateData = {
      ...(nombre !== undefined ? { nombre: String(nombre).trim() } : {}),
      precioCompra: pc,
      margen: m,
      precioVenta: round2(precioVenta),
      stock: Math.max(0, st),
      fechaActualizacion: new Date(),
    };

    const result = await req.context.collections.productos.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({
      mensaje: "Producto actualizado",
      producto: { _id: id, ...updateData },
    });
  } catch (error) {
    next(error);
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ObjectId } = req.context;

    if (!isValidObjectId(ObjectId, id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const result = await req.context.collections.productos.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
