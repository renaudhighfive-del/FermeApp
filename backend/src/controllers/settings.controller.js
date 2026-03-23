import Settings from "../models/Settings.js";

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

export const getDashboardStats = async (req, res) => {
  try {
    const { farm } = req.query;

    const Campaign = require("../models/Campaign.js").default;
    const Animal = require("../models/Animal.js").default;
    const Transaction = require("../models/Transaction.js").default;

    const activeCampaigns = await Campaign.countDocuments({
      farm,
      status: "En cours",
    });

    const totalAnimals = await Animal.countDocuments({
      campaign: {
        $in: await Campaign.find({ farm }).select("_id"),
      },
    });

    const deadAnimals = await Animal.countDocuments({
      healthStatus: "Décédé",
      campaign: {
        $in: await Campaign.find({ farm }).select("_id"),
      },
    });

    const mortality =
      totalAnimals > 0 ? ((deadAnimals / totalAnimals) * 100).toFixed(2) : 0;

    const revenue = await Transaction.aggregate([
      {
        $match: {
          farm: new (require("mongoose").Types.ObjectId)(farm),
          type: "Revenu",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      activeCampaigns,
      totalAnimals,
      deadAnimals,
      mortality,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
