import Report from "../models/Report.js";
import Campaign from "../models/Campaign.js";
import Animal from "../models/Animal.js";
import Transaction from "../models/Transaction.js";
import Sale from "../models/Sale.js";

export const generateReport = async (req, res) => {
  try {
    const { farm, reportType, campaignId, startDate, endDate } = req.body;

    let dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const campaign = campaignId
      ? await Campaign.findById(campaignId)
      : null;

    // Calculate metrics
    const animals = campaignId
      ? await Animal.countDocuments({ campaign: campaignId })
      : 0;
    const deaths = campaignId
      ? await Animal.countDocuments({
          campaign: campaignId,
          healthStatus: "Décédé",
        })
      : 0;

    const transactions = await Transaction.find({
      farm,
      ...(campaignId && { campaign: campaignId }),
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
    });

    const revenue = transactions
      .filter((t) => t.type === "Revenu")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "Dépense")
      .reduce((sum, t) => sum + t.amount, 0);

    const report = new Report({
      farm,
      reportType,
      campaign: campaignId,
      period: { startDate, endDate },
      metrics: {
        totalAnimals: animals,
        totalDeaths: deaths,
        mortalityRate: animals > 0 ? ((deaths / animals) * 100).toFixed(2) : 0,
        totalExpense: expense,
        totalRevenue: revenue,
        profitMargin: expense > 0 ? (((revenue - expense) / expense) * 100).toFixed(2) : 0,
      },
      highlights: [
        `Total de ${animals} animaux`,
        `${deaths} décès enregistrés`,
        `Revenu: ${revenue.toLocaleString()} FCFA`,
        `Dépense: ${expense.toLocaleString()} FCFA`,
      ],
      generatedBy: req.user?.id,
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const { farm, reportType, campaign, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (farm) filter.farm = farm;
    if (reportType) filter.reportType = reportType;
    if (campaign) filter.campaign = campaign;

    const reports = await Report.find(filter)
      .populate("farm")
      .populate("campaign")
      .populate("generatedBy")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(filter);

    res.json({
      reports,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("farm")
      .populate("campaign")
      .populate("generatedBy");

    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
