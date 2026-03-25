import Sale from "../models/Sale.js";

export const createSale = async (req, res) => {
  try {
    const {
      campaign,
      farm,
      saleDate,
      animalsSold,
      totalWeight,
      pricePerUnit,
      totalRevenue,
      buyer,
      notes,
    } = req.body;

    const sale = new Sale({
      campaign,
      farm,
      saleDate: saleDate || new Date(),
      animalsSold,
      totalWeight,
      pricePerUnit,
      totalRevenue,
      buyer,
      notes,
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const { campaign, farm, startDate, endDate, page = 1, limit = 20 } =
      req.query;

    let filter = {};
    if (campaign) filter.campaign = campaign;
    if (farm) filter.farm = farm;

    if (startDate || endDate) {
      filter.saleDate = {};
      if (startDate) filter.saleDate.$gte = new Date(startDate);
      if (endDate) filter.saleDate.$lte = new Date(endDate);
    }

    const sales = await Sale.find(filter)
      .populate("campaign")
      .populate("farm")
      .sort({ saleDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Sale.countDocuments(filter);

    res.json({
      sales,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("campaign")
      .populate("farm");

    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSalesStats = async (req, res) => {
  try {
    const { farm, startDate, endDate } = req.query;

    let filter = {};
    if (farm) filter.farm = farm;

    if (startDate || endDate) {
      filter.saleDate = {};
      if (startDate) filter.saleDate.$gte = new Date(startDate);
      if (endDate) filter.saleDate.$lte = new Date(endDate);
    }

    const totalSales = await Sale.countDocuments(filter);
    const totalRevenue = await Sale.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$totalRevenue" } } },
    ]);

    const totalAnimals = await Sale.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$animalsSold" } } },
    ]);

    res.json({
      totalSales,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalAnimals: totalAnimals[0]?.total || 0,
      averagePrice:
        totalAnimals[0]?.total > 0
          ? (totalRevenue[0]?.total || 0) / totalAnimals[0]?.total
          : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
