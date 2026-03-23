import Farm from "../models/Farm.js";

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
