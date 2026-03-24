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

    const { name, email, role, farms, campaignsAssignees, actif } = req.body;
    const miseAJour = {};

    if (name) miseAJour.name = name.trim();
    if (email) miseAJour.email = email.trim().toLowerCase();
    if (role) {
      if (!["admin", "gerant", "agent"].includes(role)) {
        return res.status(400).json({ message: "Rôle invalide" });
      }
      miseAJour.role = role;
      // Si on change le rôle et que c'est plus gérant/agent → vider les fermes
      if (role === "admin") {
        miseAJour.farms = [];
        miseAJour.campaignsAssignees = [];
      }
    }
    if (farms !== undefined) miseAJour.farms = farms;
    if (campaignsAssignees !== undefined) miseAJour.campaignsAssignees = campaignsAssignees;
    if (actif !== undefined) miseAJour.actif = actif;

    const userOld = await User.findById(id);
    if (!userOld) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: miseAJour },
      { new: true, runValidators: true },
    )
      .select("-__v -passwordHash");

    // Mettre à jour les relations bidirectionnelles si les fermes ou campagnes ont changé
    if (farms !== undefined || campaignsAssignees !== undefined || role !== undefined) {
      try {
        // 1. Retirer l'utilisateur des anciennes relations
        await mongoose.model('Farm').updateMany(
          { _id: { $in: userOld.farms } },
          { $pull: { managers: id, agents: id } }
        );
        await mongoose.model('Campaign').updateMany(
          { _id: { $in: userOld.campaignsAssignees } },
          { $pull: { managers: id, agents: id } }
        );

        // 2. Ajouter l'utilisateur aux nouvelles relations
        const updatedFarms = farms !== undefined ? farms : userOld.farms;
        const updatedCampaigns = campaignsAssignees !== undefined ? campaignsAssignees : userOld.campaignsAssignees;
        const updatedRole = role !== undefined ? role : userOld.role;

        if (updatedRole === 'gerant') {
          await mongoose.model('Farm').updateMany(
            { _id: { $in: updatedFarms } },
            { $addToSet: { managers: id } }
          );
          await mongoose.model('Campaign').updateMany(
            { _id: { $in: updatedCampaigns } },
            { $addToSet: { managers: id } }
          );
        } else if (updatedRole === 'agent') {
          await mongoose.model('Farm').updateMany(
            { _id: { $in: updatedFarms } },
            { $addToSet: { agents: id } }
          );
          await mongoose.model('Campaign').updateMany(
            { _id: { $in: updatedCampaigns } },
            { $addToSet: { agents: id } }
          );
        }
      } catch (updateErr) {
        console.error("Erreur lors de la mise à jour des relations bidirectionnelles (update):", updateErr);
      }
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

// ── Activer/Désactiver un user ─────────────────────────────────────
export async function toggleUserStatus(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const userToToggle = await User.findById(id);
    if (!userToToggle) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // On inverse le statut actuel
    const nouveauStatut = !userToToggle.actif;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { actif: nouveauStatut } },
      { new: true },
    ).select("name email role actif");

    res.json({ 
      message: nouveauStatut ? "Utilisateur activé" : "Utilisateur désactivé", 
      user 
    });
  } catch (err) {
    return next(err)
  }
}

// ── Supprimer un user (admin seulement) ───────────────────────────
export async function supprimerUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // 1. Nettoyer les relations dans les fermes et campagnes
    try {
      await mongoose.model('Farm').updateMany(
        { _id: { $in: user.farms } },
        { $pull: { managers: id, agents: id } }
      );
      await mongoose.model('Campaign').updateMany(
        { _id: { $in: user.campaignsAssignees } },
        { $pull: { managers: id, agents: id } }
      );
    } catch (cleanErr) {
      console.error("Erreur lors du nettoyage des relations (delete):", cleanErr);
    }

    // 2. Supprimer l'utilisateur
    await User.findByIdAndDelete(id);

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    return next(err)
  }
}
