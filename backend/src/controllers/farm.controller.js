import Farm from "../models/Farm.js";
import Campaign from "../models/Campaign.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import Sale from "../models/Sale.js";
import Report from "../models/Report.js";
import TransferLog from "../models/TransferLog.js";
import mongoose from "mongoose";

export const createFarm = async (req, res) => {
  try {
    const { name, location, owner, productionTypes } = req.body;

    const farm = new Farm({
      name,
      location,
      owner,
      productionTypes,
    });

    await farm.save();
    res.status(201).json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getFarms = async (req, res) => {
  try {
    const { page = 1, limit = 10, owner } = req.query;
    let filter = { active: true };
    if (owner) filter.owner = owner;

    const farms = await Farm.find(filter)
      .populate("owner")
      .populate("managers")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Farm.countDocuments(filter);

    res.json({
      farms,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id)
      .populate("owner")
      .populate("managers");

    if (!farm) return res.status(404).json({ error: "Farm not found" });
    res.json(farm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("owner")
      .populate("managers");

    if (!farm) return res.status(404).json({ error: "Farm not found" });
    res.json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    await Farm.findByIdAndUpdate(req.params.id, { active: false });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const transferFarmData = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: sourceFarmId } = req.params;
    const {
      targetFarmId,
      reason = "Incident opérationnel",
      mode = "execute",
    } = req.body ?? {};

    if (!["dry-run", "execute"].includes(mode)) {
      return res.status(400).json({ error: "Mode invalide: utilisez dry-run ou execute" });
    }

    if (!mongoose.Types.ObjectId.isValid(sourceFarmId) || !mongoose.Types.ObjectId.isValid(targetFarmId)) {
      return res.status(400).json({ error: "IDs de fermes invalides" });
    }

    if (String(sourceFarmId) === String(targetFarmId)) {
      return res.status(400).json({ error: "La ferme source et cible doivent être différentes" });
    }

    const [sourceFarm, targetFarm] = await Promise.all([
      Farm.findById(sourceFarmId).session(session),
      Farm.findById(targetFarmId).session(session),
    ]);

    if (!sourceFarm || !targetFarm) {
      return res.status(404).json({ error: "Ferme source ou cible introuvable" });
    }

    if (!sourceFarm.active) {
      return res.status(400).json({ error: "La ferme source est déjà inactive" });
    }

    if (!targetFarm.active) {
      return res.status(400).json({ error: "La ferme cible doit être active pour recevoir le transfert" });
    }

    const [campaignCount, productCount, transactionCount, saleCount, reportCount] =
      await Promise.all([
        Campaign.countDocuments({ farm: sourceFarmId }).session(session),
        Product.countDocuments({ farm: sourceFarmId }).session(session),
        Transaction.countDocuments({ farm: sourceFarmId }).session(session),
        Sale.countDocuments({ farm: sourceFarmId }).session(session),
        Report.countDocuments({ farm: sourceFarmId }).session(session),
      ]);

    const payload = {
      sourceFarm: { id: sourceFarm._id, name: sourceFarm.name },
      targetFarm: { id: targetFarm._id, name: targetFarm.name },
      reason,
      mode,
      impact: {
        campaigns: campaignCount,
        products: productCount,
        transactions: transactionCount,
        sales: saleCount,
        reports: reportCount,
      },
    };

    if (mode === "dry-run") {
      await session.abortTransaction();
      await TransferLog.create({
        sourceFarm: sourceFarm._id,
        targetFarm: targetFarm._id,
        reason,
        mode: "dry-run",
        impact: payload.impact,
        transferredBy: req.user?.userId || null,
      });
      return res.json(payload);
    }

    await Promise.all([
      Campaign.updateMany({ farm: sourceFarmId }, { $set: { farm: targetFarmId } }, { session }),
      Product.updateMany({ farm: sourceFarmId }, { $set: { farm: targetFarmId } }, { session }),
      Transaction.updateMany({ farm: sourceFarmId }, { $set: { farm: targetFarmId } }, { session }),
      Sale.updateMany({ farm: sourceFarmId }, { $set: { farm: targetFarmId } }, { session }),
      Report.updateMany({ farm: sourceFarmId }, { $set: { farm: targetFarmId } }, { session }),
      Farm.findByIdAndUpdate(sourceFarmId, { $set: { active: false } }, { session }),
      TransferLog.create(
        [
          {
            sourceFarm: sourceFarm._id,
            targetFarm: targetFarm._id,
            reason,
            mode: "execute",
            impact: payload.impact,
            transferredBy: req.user?.userId || null,
          },
        ],
        { session }
      ),
    ]);

    await session.commitTransaction();
    return res.json({
      ...payload,
      message: "Transfert effectué avec succès",
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const listTransferLogs = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const logs = await TransferLog.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("sourceFarm", "name")
      .populate("targetFarm", "name")
      .populate("transferredBy", "name email role");

    return res.json({ logs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
