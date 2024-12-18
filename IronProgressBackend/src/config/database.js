const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configuración de la conexión a PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Nombre de la base de datos
  process.env.DB_USER,       // Usuario
  process.env.DB_PASSWORD,   // Contraseña
  {
    host: process.env.DB_HOST, // Host (localhost)
    port: process.env.DB_PORT, // Puerto (5432)
    dialect: "postgres",       // Motor de base de datos
    logging: false,            // Desactiva los logs de SQL (opcional)
  }
);

module.exports = sequelize;
