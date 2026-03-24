import bcrypt   from 'bcryptjs'
import mongoose from 'mongoose'
import { User } from '../models/User.js'

export async function creerOneUser({ name, email, password, role, campaignsAssignees, farms }) {

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

  // ── Validation farms si gérant ou agent ────────────────────────
  let userFarms = []
  if (role === 'gerant' || role === 'agent') {
    if (!Array.isArray(farms) || farms.length === 0) {
      const err = new Error('Un gérant ou agent doit être assigné à au moins une ferme')
      err.statusCode = 400
      throw err
    }
    const tousValides = farms.every(id => mongoose.Types.ObjectId.isValid(id))
    if (!tousValides) {
      const err = new Error('Un ou plusieurs IDs de ferme sont invalides')
      err.statusCode = 400
      throw err
    }
    userFarms = farms
  }

  // ── Validation campaignsAssignees si agent (optionnel si gérant) ──
  let campaigns = []
  if (role === 'agent' || role === 'gerant') {
    if (Array.isArray(campaignsAssignees) && campaignsAssignees.length > 0) {
      const tousValides = campaignsAssignees.every(id => mongoose.Types.ObjectId.isValid(id))
      if (!tousValides) {
        const err = new Error('Un ou plusieurs IDs de campagne sont invalides')
        err.statusCode = 400
        throw err
      }
      campaigns = campaignsAssignees
    } else if (role === 'agent') {
      const err = new Error('Un agent doit être assigné à au moins une campagne')
      err.statusCode = 400
      throw err
    }
  }

  // ── Création ──────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(password, 12)

  const user = await User.create({
    name:             name.trim(),
    email:           normalizedEmail,
    passwordHash,
    role,
    farms:           userFarms,
    campaignsAssignees: campaigns,
  })

  // ── Mettre à jour les fermes et campagnes avec le nouvel utilisateur ──
  try {
    if (role === 'gerant') {
      await mongoose.model('Farm').updateMany(
        { _id: { $in: userFarms } },
        { $addToSet: { managers: user._id } }
      )
      if (campaigns.length > 0) {
        await mongoose.model('Campaign').updateMany(
          { _id: { $in: campaigns } },
          { $addToSet: { managers: user._id } }
        )
      }
    } else if (role === 'agent') {
      await mongoose.model('Farm').updateMany(
        { _id: { $in: userFarms } },
        { $addToSet: { agents: user._id } }
      )
      await mongoose.model('Campaign').updateMany(
        { _id: { $in: campaigns } },
        { $addToSet: { agents: user._id } }
      )
    }
  } catch (updateErr) {
    console.error("Erreur lors de la mise à jour des relations bidirectionnelles:", updateErr)
  }

  // ── Retourner sans le hash ────────────────────────────────────
  const { passwordHash: _, ...userPropre } = user.toObject()
  return userPropre
}