import bcrypt   from 'bcryptjs'
import mongoose from 'mongoose'
import { User } from '../models/User.js'

export async function creerOneUser({ name, email, password, role, fermesAssignees }) {

  // ── Validations ──────────────────────────────────────────────
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    const err = new Error('Le name doit contenir au moins 2 caractères')
    err.statusCode = 400
    throw err
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    const err = new Error('Email invalide')
    err.statusCode = 400
    throw err
  }

  if (!password || password.length < 6) {
    const err = new Error('Mot de passe trop court (6 caractères minimum)')
    err.statusCode = 400
    throw err
  }

  if (!['admin', 'gerant', 'agent'].includes(role)) {
    const err = new Error('Rôle invalide')
    err.statusCode = 400
    throw err
  }

  // ── Vérification email unique ─────────────────────────────────
  const normalizedEmail = email.trim().toLowerCase()

  const existeDeja = await User.findOne({ email: normalizedEmail })
  if (existeDeja) {
    const err = new Error('Cet email est déjà utilisé')
    err.statusCode = 409
    throw err
  }

  // ── Validation fermesAssignees si gérant ──────────────────────
  let fermes = []
  if (role === 'gerant') {
    if (!Array.isArray(fermesAssignees) || fermesAssignees.length === 0) {
      const err = new Error('Un gérant doit avoir au moins une ferme assignée')
      err.statusCode = 400
      throw err
    }
    const tousValides = fermesAssignees.every(id => mongoose.Types.ObjectId.isValid(id))
    if (!tousValides) {
      const err = new Error('Un ou plusieurs IDs de ferme sont invalides')
      err.statusCode = 400
      throw err
    }
    fermes = fermesAssignees
  }

  // ── Création ──────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(password, 12)

  const user = await User.create({
    name:             name.trim(),
    email:           normalizedEmail,
    passwordHash,
    role,
    fermesAssignees: fermes,
  })

  // ── Retourner sans le hash ────────────────────────────────────
  const { passwordHash: _, ...userPropre } = user.toObject()
  return userPropre
}