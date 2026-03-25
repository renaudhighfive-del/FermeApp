import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: false, // peut être null si c'est une action sur lot entier
    },
    type: {
      type: String,
      enum: [
        "feeding",       // distribution alimentaire
        "mortality",     // mortalité
        "vaccination",   // vaccination
        "treatment",     // traitement/médicament
        "weight",        // pesée
        "other"          // autre action ponctuelle
      ],
      required: true,
    },
    quantity: { type: Number, default: 0 }, // kg, nb d’animaux, doses…
    description: { type: String },          // infos complémentaires
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lot: { type: String },                  // Lot A / B / C
    status: { type: String, enum: ["pending","done"], default: "pending" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);
export default mongoose.model("Event", eventSchema);
