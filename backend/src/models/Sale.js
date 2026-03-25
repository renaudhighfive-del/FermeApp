import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    saleDate: { type: Date, default: Date.now },
    animalsSold: { type: Number, required: true },
    totalWeight: { type: Number }, // kg
    pricePerUnit: { type: Number, required: true }, // FCFA
    totalRevenue: { type: Number, required: true }, // FCFA
    buyer: String,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
