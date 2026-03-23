import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    animalType: {
      type: String,
      enum: ["Volaille", "Bétail", "Pisciculture"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Préparation", "En cours", "Terminée"],
      default: "Préparation",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    initialAnimalCount: { type: Number, required: true },
    currentAnimalCount: { type: Number, required: true },
    deaths: { type: Number, default: 0 },
    mortality: { type: Number, default: 0 }, // percentage
    feedConsumed: { type: Number, default: 0 }, // kg
    feedCost: { type: Number, default: 0 }, // FCFA
    expectedRevenue: { type: Number, default: 0 }, // FCFA
    actualRevenue: { type: Number, default: 0 }, // FCFA
    fcr: { type: Number, default: 0 }, // Feed Conversion Ratio
    budget: { type: Number, required: true }, // FCFA
    spent: { type: Number, default: 0 }, // FCFA
    notes: String,
    predictions: {
      expectedMortalityRate: Number,
      expectedYield: Number,
      expectedProfit: Number,
      riskLevel: { type: String, enum: ["Low", "Medium", "High"] },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
