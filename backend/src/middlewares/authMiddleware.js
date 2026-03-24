// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  
  if (!header) {
    return res.status(401).json({ error: { message: "Missing Authorization header" } });
  }
  const [type, token] = header.split(" ");

  console.log(JWT_SECRET);

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: { message: "Invalid Authorization format" } });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: payload.userId,
      role: payload.role,
      email: payload.email
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: { message: "Invalid or expired token" } });
  }
}

export function autoriser(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Accès refusé — rôle requis : ${roles.join(" ou ")}`
      });
    }

    return next();
  };
}