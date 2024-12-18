const express = require("express");
const User = require("../models/User");
const { validate: isUUID } = require("uuid");
const authMiddleware = require("../middleware/authMiddleware");



const router = express.Router();

router.get("/list", authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de usuariO con email y contraseña POST /api/users/login con un JSON con email y password 
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar contraseña (por ahora asumimos 'password' como campo)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol }, // Payload
      "secretKey", // Clave secreta (cámbiala por una variable de entorno)
      { expiresIn: "1h" } // Expira en 1 hora
    );

    res.json({ mensaje: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un usuariO con nombre, email y rol (admin, powerlifter, bodybuilder) por defecto es powerlifter si no se especifica el rol en el body de la peticion POST /api/users/create  con un JSON 
router.post("/create", async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const newUser = await User.create({ nombre, email, password, rol });
    res.status(201).json({ mensaje: "Usuario creado", usuario: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un usuario por UUID esto es super importante porque es un identificador unico para cada usuario y no se puede repetir en la base de datos
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  // Validar si el ID es un UUID válido
  if (!isUUID(id)) {
    return res.status(400).json({ mensaje: "ID inválido" });
  }

  try {
    const deleted = await User.destroy({ where: { id } });

    if (deleted) {
      res.json({ mensaje: `Usuario con ID ${id} eliminado correctamente` });
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Obtener todos los usuarios de la base de datos GET /api/users/list 
router.get("/list", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un usuario por UUID PUT /api/users/update/:id con un JSON con los campos a actualizar 
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;

  // Validar si el ID es un UUID válido
  if (!isUUID(id)) {
    return res.status(400).json({ mensaje: "ID inválido" });
  }

  const { nombre, email, rol } = req.body;

  try {
    const [updated] = await User.update(
      { nombre, email, rol }, // Campos a actualizar
      { where: { id } }       // Buscar por UUID
    );

    if (updated) {
      const updatedUser = await User.findOne({ where: { id } });
      return res.json({ mensaje: "Usuario actualizado", usuario: updatedUser });
    }

    res.status(404).json({ mensaje: "Usuario no encontrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
