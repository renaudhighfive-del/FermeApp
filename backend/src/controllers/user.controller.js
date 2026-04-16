import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import Campaign from "../models/Campaign.js";
import Event from "../models/Events.js";
import UserLifecycleEvent from "../models/UserLifecycleEvent.js";
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

// ── Lister tous les users (admin et gerant) ───────────────────────
export async function listerUsers(req, res, next) {
  try {
    const {
      role,
      actif,
      archived,
      includeArchived = "false",
      page = 1,
      limit = 20,
    } = req.query;

    const filtre = {};
    
    // Si l'utilisateur n'est pas admin, il ne peut voir que les agents
    if (req.user.role !== 'admin') {
      filtre.role = 'agent';
    } else if (role) {
      filtre.role = role;
    }

    if (actif !== undefined) filtre.actif = actif === "true";
    if (archived !== undefined) {
      filtre.archivedAt = archived === "true" ? { $ne: null } : null;
    } else if (includeArchived !== "true") {
      filtre.archivedAt = null;
    }

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

// ── Profil enrichi utilisateur ─────────────────────────────────────
export async function obtenirUserProfile(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const user = await User.findById(id)
      .select("-__v -passwordHash")
      .populate("farms", "name location active")
      .populate("campaignsAssignees", "name status startDate endDate farm")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const [managedCampaignsCount, activeManagedCampaignsCount, eventsAssignedCount, eventsCreatedCount] =
      await Promise.all([
        Campaign.countDocuments({
          $or: [{ managers: id }, { agents: id }],
        }),
        Campaign.countDocuments({
          status: "En cours",
          $or: [{ managers: id }, { agents: id }],
        }),
        Event.countDocuments({ assignedTo: id }),
        Event.countDocuments({ createdBy: id }),
      ]);

    const profile = {
      ...user,
      stats: {
        farmsAssignedCount: user.farms?.length || 0,
        campaignsAssignedCount: user.campaignsAssignees?.length || 0,
        activeAssignedCampaignsCount:
          user.campaignsAssignees?.filter((c) => c.status === "En cours").length || 0,
        managedCampaignsCount,
        activeManagedCampaignsCount,
        eventsAssignedCount,
        eventsCreatedCount,
      },
      lifecycle: await UserLifecycleEvent.find({ user: id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("actor", "name email role")
        .lean(),
    };

    return res.json({ user: profile });
  } catch (err) {
    return next(err);
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
    ).select("name email role actif archivedAt archivedBy archiveReason");

    await UserLifecycleEvent.create({
      user: id,
      action: "status_toggled",
      actor: req.user?.userId || null,
      metadata: {
        actif: user?.actif,
      },
    });

    res.json({ 
      message: nouveauStatut ? "Utilisateur activé" : "Utilisateur désactivé", 
      user 
    });
  } catch (err) {
    return next(err)
  }
}

// ── Archiver un user (admin seulement) ────────────────────────────
export async function archiverUser(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body ?? {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const archivedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          actif: false,
          archivedAt: new Date(),
          archivedBy: req.user?.userId || null,
          archiveReason: typeof reason === "string" ? reason.trim() : null,
        },
      },
      { new: true }
    ).select("name email role actif archivedAt archivedBy archiveReason");

    await UserLifecycleEvent.create({
      user: id,
      action: "archived",
      actor: req.user?.userId || null,
      metadata: {
        reason: typeof reason === "string" ? reason.trim() : null,
      },
    });

    return res.json({
      message: "Utilisateur archivé avec succès",
      user: archivedUser,
    });
  } catch (err) {
    return next(err)
  }
}
