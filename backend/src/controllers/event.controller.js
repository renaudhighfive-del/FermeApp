import mongoose from "mongoose";
import Event from "../models/Events.js";

// --- Lister toutes les tâches (Admin) ---
export const getAllEvents = async (req, res, next) => {
  try {
    const { campaign, status, type, assignedTo } = req.query;
    const filter = {};
    if (campaign) filter.campaign = campaign;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (assignedTo) filter.assignedTo = assignedTo;

    const events = await Event.find(filter)
      .populate("campaign", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name")
      .populate("animal", "idNumber")
      .sort({ createdAt: -1 });

    res.json({ events });
  } catch (err) {
    next(err);
  }
};

// --- Créer une tâche ---
export const createEvent = async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user._id
    };
    const event = await Event.create(eventData);
    const populated = await Event.findById(event._id)
      .populate("campaign", "name")
      .populate("assignedTo", "name email");
    res.status(201).json({ event: populated });
  } catch (err) {
    next(err);
  }
};

// --- Modifier une tâche ---
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true })
      .populate("campaign", "name")
      .populate("assignedTo", "name email");
    if (!event) return res.status(404).json({ message: "Tâche introuvable" });
    res.json({ event });
  } catch (err) {
    next(err);
  }
};

// --- Supprimer une tâche ---
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: "Tâche introuvable" });
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    next(err);
  }
};
