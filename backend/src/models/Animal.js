import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    idNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Volaille", "Bétail", "Pisciculture"] },
    breed: String,
    dateOfBirth: Date,
    weight: { type: Number }, // kg
    healthStatus: {
      type: String,
      enum: ["Sain", "Malade", "Suspect", "Décédé"],
      default: "Sain",
    },
    vaccinations: [
      {
        vaccine: String,
        date: Date,
        nextDue: Date,
      },
    ],
    treatmentHistory: [
      {
        treatment: String,
        date: Date,
        reason: String,
        outcome: String,
      },
    ],
    location: { type: String }, // shed/location within farm
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Animal", animalSchema);
