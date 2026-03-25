import Animal from "../models/Animal.js";

export const createAnimal = async (req, res) => {
  try {
    const { campaign, idNumber, type, breed, dateOfBirth, weight } = req.body;

    const animal = new Animal({
      campaign,
      idNumber,
      type,
      breed,
      dateOfBirth,
      weight,
    });

    await animal.save();
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAnimals = async (req, res) => {
  try {
    const { campaign, healthStatus, type, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (campaign) filter.campaign = campaign;
    if (healthStatus) {
      // Map health status for filtering
      if (healthStatus === 'Sain') filter.healthStatus = 'Sain';
      else if (healthStatus === 'Anomalie') filter.healthStatus = { $in: ['Malade', 'Suspect'] };
      else if (healthStatus === 'Observation') filter.healthStatus = 'Suspect';
      else filter.healthStatus = healthStatus;
    }
    if (type) filter.type = type;

    const animals = await Animal.find(filter)
      .populate("campaign")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Animal.countDocuments(filter);

    res.json({
      animals,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).populate("campaign");
    if (!animal) return res.status(404).json({ error: "Animal not found" });
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("campaign");

    if (!animal) return res.status(404).json({ error: "Animal not found" });
    res.json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAnimal = async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
