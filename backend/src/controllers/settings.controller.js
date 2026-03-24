import Settings from "../models/Settings.js";
import Campaign from "../models/Campaign.js";
import Animal from "../models/Animal.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const getSettings = async (req, res) => {
  try {
    const { farm } = req.query;

    const settings = await Settings.findOne({ farm });
    if (!settings) return res.status(404).json({ error: "Settings not found" });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { farm } = req.body;
    const settings = await Settings.findOneAndUpdate(
      { farm },
      req.body,
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    let { farm } = req.query;

    // Si pas de farm en paramètre, utiliser la première farm de l'utilisateur
    if (!farm) {
      const farms = await mongoose.model("Farm").find().limit(1);
      if (farms.length === 0) {
        return res.json({
          activeCampaigns: 0,
          totalAnimals: 0,
          deadAnimals: 0,
          mortality: 0,
          totalRevenue: 0,
        });
      }
      farm = farms[0]._id;
    }

    const farmId = new mongoose.Types.ObjectId(farm);

    // Compter les campagnes actives
    const activeCampaigns = await Campaign.countDocuments({
      farm: farmId,
      status: "En cours",
    });

    // Obtenir toutes les campagnes pour cette farm
    const campaigns = await Campaign.find({ farm: farmId }).select("_id");
    const campaignIds = campaigns.map((c) => c._id);

    // Compter les animaux - soit par campaign, soit tous les animaux si pas de campaign
    let totalAnimals = 0;
    let deadAnimals = 0;

    if (campaignIds.length > 0) {
      totalAnimals = await Animal.countDocuments({
        campaign: { $in: campaignIds },
      });

      deadAnimals = await Animal.countDocuments({
        campaign: { $in: campaignIds },
        healthStatus: "Décédé",
      });
    } else {
      // Si pas de campaign, compter tous les animaux
      totalAnimals = await Animal.countDocuments({});
      deadAnimals = await Animal.countDocuments({
        healthStatus: "Décédé",
      });
    }

    const mortality =
      totalAnimals > 0 ? ((deadAnimals / totalAnimals) * 100).toFixed(2) : 0;

    // Compter les revenus
    const revenue = await Transaction.aggregate([
      {
        $match: {
          farm: farmId,
          type: "Revenu",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("[DASHBOARD STATS]", {
      farm: farmId,
      campaigns: campaignIds.length,
      totalAnimals,
      deadAnimals,
      mortality,
    });

    res.json({
      activeCampaigns,
      totalAnimals,
      deadAnimals,
      mortality: parseFloat(mortality),
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    console.error("[ERROR getDashboardStats]:", error.message);
    res.status(500).json({ error: error.message });
  }
};
