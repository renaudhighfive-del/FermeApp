import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { creerOneUser } from "../services/user.service.js";

// ── Créer un user (admin seulement) ──────────────────────────────
export async function creerUser(req, res, next) {
  try {
    const user = await creerOneUser(req.body);
    res.status(201).json({ message: "Compte créé avec succès", user });
  } catch (err) {
    return next(err)
  }
}

// ── Lister tous les users (admin seulement) ───────────────────────
export async function listerUsers(req, res, next) {
  try {
    const { role, actif, page = 1, limit = 20 } = req.query;

    const filtre = {};
    if (role) filtre.role = role;
    if (actif !== undefined) filtre.actif = actif === "true";

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filtre);

    const users = await User.find(filtre)
      .select("-__v -passwordHash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (err) {
    return next(err)
  }
}

// ── Obtenir un user par ID ────────────────────────────────────────
export async function obtenirUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const user = await User.findById(id)
      .select("-__v -passwordHash")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ user });
  } catch (err) {
    return next(err)
  }
}

// ── Modifier un user (admin seulement) ────────────────────────────
export async function modifierUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const { name, email, role, fermesAssignees, actif } = req.body;
    const miseAJour = {};

    if (name) miseAJour.name = name.trim();
    if (email) miseAJour.email = email.trim().toLowerCase();
    if (role) {
      if (!["admin", "gerant", "agent"].includes(role)) {
        return res.status(400).json({ message: "Rôle invalide" });
      }
      miseAJour.role = role;
      // Si on change le rôle et que c'est plus gérant → vider les fermes
      if (role !== "gerant") miseAJour.fermesAssignees = [];
    }
    if (fermesAssignees !== undefined)
      miseAJour.fermesAssignees = fermesAssignees;
    if (actif !== undefined) miseAJour.actif = actif;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: miseAJour },
      { new: true, runValidators: true },
    )
      .select("-__v -passwordHash");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Utilisateur mis à jour", user });
  } catch (err) {
    return next(err)
  }
}

// ── Réinitialiser le mot de passe (admin seulement) ───────────────
export async function reinitialiserMotDePasse(req, res, next) {
  try {
    const { id } = req.params;
    const { nouveauMotDePasse } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    if (!nouveauMotDePasse || nouveauMotDePasse.length < 6) {
      return res
        .status(400)
        .json({ message: "Mot de passe trop court (6 caractères minimum)" });
    }

    const passwordHash = await bcrypt.hash(nouveauMotDePasse, 12);

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { passwordHash } },
      { new: true },
    ).select("name email role");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Mot de passe réinitialisé avec succès", user });
  } catch (err) {
    return next(err)
  }
}

// ── Désactiver un user — soft delete ─────────────────────────────
export async function desactiverUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    // Soft delete : on désactive plutôt que supprimer
    // pour garder l'historique des campagnes liées à cet user
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { actif: false } },
      { new: true },
    ).select("name email role actif");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Utilisateur désactivé", user });
  } catch (err) {
    return next(err)
  }
}
