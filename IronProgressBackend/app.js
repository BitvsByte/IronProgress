const express = require("express");
const sequelize = require("./src/config/database");
const User = require("./src/models/User");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

// Probar la conexión y sincronizar modelos
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL exitosa");

    await sequelize.sync(); // Sincroniza modelos
    console.log("✅ Modelos sincronizados");
  } catch (error) {
    console.error("❌ Error al conectar o sincronizar:", error.message);
  }
})();

console.log(app._router.stack.map(r => r.route?.path).filter(Boolean));

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
