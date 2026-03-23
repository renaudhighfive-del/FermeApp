import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    type: {
      type: String,
      enum: ["Vaccination", "Traitement", "Diagnostic", "Observation"],
      required: true,
    },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    nextScheduledDate: Date,
    status: {
      type: String,
      enum: ["Complété", "En attente", "Programmé"],
      default: "Complété",
    },
    notes: String,
    adminName: String, // who recorded it
  },
  { timestamps: true }
);

export default mongoose.model("HealthRecord", healthRecordSchema);
