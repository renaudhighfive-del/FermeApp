import Campaign from "../models/Campaign.js";
import Animal from "../models/Animal.js";

export const createCampaign = async (req, res) => {
  try {
    const { name, farm, animalType, startDate, initialAnimalCount, budget } =
      req.body;

    const campaign = new Campaign({
      name,
      farm,
      animalType,
      startDate,
      initialAnimalCount,
      currentAnimalCount: initialAnimalCount,
      budget,
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const { farm, status, animalType, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (farm) filter.farm = farm;
    if (status) filter.status = status;
    if (animalType) filter.animalType = animalType;

    const campaigns = await Campaign.find(filter)
      .populate("farm")
      .populate("agents", "name email role")
      .populate("managers", "name email role")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Campaign.countDocuments(filter);

    res.json({
      campaigns,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("farm")
      .populate("agents", "name email role")
      .populate("managers", "name email role");
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("farm");

    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    await Animal.deleteMany({ campaign: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCampaignStats = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    const animals = await Animal.countDocuments({ campaign: campaignId });
    const deadAnimals = await Animal.countDocuments({
      campaign: campaignId,
      healthStatus: "Décédé",
    });

    const mortality = animals > 0 ? (deadAnimals / campaign.initialAnimalCount) * 100 : 0;

    res.json({
      totalAnimals: animals,
      deadAnimals,
      mortality: mortality.toFixed(2),
      budget: campaign.budget,
      spent: campaign.spent,
      revenue: campaign.actualRevenue,
      fcr: campaign.fcr,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
