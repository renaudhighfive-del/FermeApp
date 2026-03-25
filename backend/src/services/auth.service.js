import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_code";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";



// ── Login ─────────────────────────────────────────────────────────
export async function loginUser({ email, password }) {

  if (typeof email !== "string" || typeof password !== "string") {
    const err = new Error("email and password are required");
    err.statusCode = 400;
    throw err;
  }

  // DÉCLARATION AVANT UTILISATION
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail, actif: true }).select("+passwordHash");

  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { userId: String(user._id), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: user.toJSON()
  };
}


// ── Get me ────────────────────────────────────────────────────────
export async function getMe(userId) {
  return User.findById(userId)
             .populate('fermesAssignees', 'nom')
             .select('-__v')
             .lean(); // retourne un object js pur , plus léger qu'un document Mongoose
}


