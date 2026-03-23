import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const {
      farm,
      campaign,
      type,
      category,
      amount,
      description,
      reference,
      paymentMethod,
      date,
    } = req.body;

    const transaction = new Transaction({
      farm,
      campaign,
      type,
      category,
      amount,
      description,
      reference,
      paymentMethod,
      date: date || new Date(),
      status: "Confirmée",
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const {
      farm,
      campaign,
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    let filter = {};
    if (farm) filter.farm = farm;
    if (campaign) filter.campaign = campaign;
    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .populate("farm")
      .populate("campaign")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("farm")
      .populate("campaign");

    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("farm")
      .populate("campaign");

    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFinancialSummary = async (req, res) => {
  try {
    const { farm, startDate, endDate } = req.query;

    let filter = {};
    if (farm) filter.farm = farm;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const revenues = await Transaction.aggregate([
      { $match: { ...filter, type: "Revenu" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const expenses = await Transaction.aggregate([
      { $match: { ...filter, type: "Dépense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const totalRevenue = await Transaction.aggregate([
      { $match: { ...filter, type: "Revenu" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Transaction.aggregate([
      { $match: { ...filter, type: "Dépense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      revenues,
      expenses,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      profit: (totalRevenue[0]?.total || 0) - (totalExpense[0]?.total || 0),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
