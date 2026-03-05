require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB
const urlDB = process.env.DATABASE_URL;
if (!urlDB) {
  console.error("❌ Falta DATABASE_URL en el archivo .env");
  process.exit(1);
}
const client = new MongoClient(urlDB);

async function connectToDatabase() {
  try {
    await client.connect();

    // Ping para confirmar conexión real
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Conectado a MongoDB Atlas");

    const dbName = process.env.DATABASE || "tienda-db";
    const db = client.db(dbName);

    const productosCollection = db.collection("productos");

    // Inyectar colecciones y utilidades en req.context
    app.use((req, res, next) => {
      req.context = {
        collections: { productos: productosCollection },
        ObjectId,
      };
      next();
    });

    // Rutas
    const productosRoutes = require("./routes/productos");
    app.use("/api/productos", productosRoutes);

    // Ruta rápida de salud
    app.get("/api/health", (req, res) => {
      res.json({ ok: true, message: "Backend funcionando ✅" });
    });

    // Middleware de errores (para next(error))
    app.use((err, req, res, next) => {
      console.error("❌ Error:", err);
      res.status(500).json({
        mensaje: "Error del servidor",
        detalle: err.message,
      });
    });

    // Arrancar servidor
    const server = app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });

    // Cerrar conexión cuando cierres el server (Ctrl+C)
    process.on("SIGINT", async () => {
      console.log("\n🛑 Cerrando servidor...");
      await client.close();
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  }
}

connectToDatabase();
