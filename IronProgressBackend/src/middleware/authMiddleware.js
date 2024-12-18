const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const verified = jwt.verify(token, "secretKey");
    req.user = verified; // Almacena los datos del usuario en req.user
    next();
  } catch (error) {
    res.status(400).json({ mensaje: "Token inválido" });
  }
};

module.exports = authMiddleware;
