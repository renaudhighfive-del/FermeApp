import HealthRecord from "../models/HealthRecord.js";
import Animal from "../models/Animal.js";

export const createHealthRecord = async (req, res) => {
  try {
    const {
      animal,
      campaign,
      type,
      description,
      date,
      nextScheduledDate,
      status,
      assignedTo,
      notes,
    } = req.body;

    const record = new HealthRecord({
      animal,
      campaign,
      type,
      description,
      date: date || new Date(),
      nextScheduledDate,
      status: status || "Complété",
      assignedTo,
      notes,
      adminName: req.user?.name,
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getHealthRecords = async (req, res) => {
  try {
    const { animal, campaign, type, status, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (animal) filter.animal = animal;
    if (campaign) filter.campaign = campaign;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const records = await HealthRecord.find(filter)
      .populate("animal")
      .populate("campaign")
      .populate("assignedTo", "name email")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HealthRecord.countDocuments(filter);

    res.json({
      records,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("animal")
      .populate("campaign");

    if (!record)
      return res.status(404).json({ error: "Health record not found" });
    res.json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteHealthRecord = async (req, res) => {
  try {
    await HealthRecord.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUpcomingVaccinations = async (req, res) => {
  try {
    const { campaign } = req.query;

    let filter = {
      type: "Vaccination",
      status: "Programmé",
      nextScheduledDate: {
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
      },
    };

    if (campaign) filter.campaign = campaign;

    const records = await HealthRecord.find(filter)
      .populate("animal")
      .populate("campaign")
      .populate("assignedTo", "name email")
      .sort({ nextScheduledDate: 1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAlerts = async (req, res) => {
  try {
    // Get health records with status 'En attente' (pending alerts)
    const healthAlerts = await HealthRecord.find({ status: "En attente" })
      .populate("animal")
      .populate("campaign")
      .sort({ date: -1 });

    // Get animals with health issues
    const sickAnimals = await Animal.find({ 
      healthStatus: { $in: ["Malade", "Suspect"] } 
    })
      .populate("campaign")
      .sort({ updatedAt: -1 });

    // Convert to alerts format with priority
    const alerts = [
      // Critical: Sick animals
      ...sickAnimals.map(animal => ({
        _id: animal._id,
        type: "health_status",
        priority: "urgent",
        title: `Animal ${animal.healthStatus}`,
        description: `Animal ${animal.idNumber} - Statut: ${animal.healthStatus}`,
        animal: animal,
        campaign: animal.campaign,
        date: animal.updatedAt,
        resolved: false
      })),
      // Warnings: Pending health records
      ...healthAlerts.map(record => ({
        _id: record._id,
        type: "health_record",
        priority: record.type === "Vaccination" ? "warning" : record.type === "Diagnostic" ? "urgent" : "info",
        title: `${record.type} en attente - ${record.animal?.idNumber || "N/A"}`,
        description: record.description,
        animal: record.animal,
        campaign: record.campaign,
        date: record.date,
        resolved: record.status === "Complété"
      }))
    ];

    res.json({
      alerts: alerts.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
