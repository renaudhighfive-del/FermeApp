// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ;


export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: { message: "Missing Authorization header" } });
  }
  const [type, token] = header.split(" ");
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
    // jsonwebtoken lève : TokenExpiredError, JsonWebTokenError, NotBeforeError
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

    next();
  };
}