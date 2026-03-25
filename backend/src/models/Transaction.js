import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      sparse: true,
    },
    type: {
      type: String,
      enum: ["Revenu", "Dépense"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Aliment",
        "Médicament",
        "Équipement",
        "Vente",
        "Eau",
        "Électricité",
        "Main-d'œuvre",
        "Autre",
      ],
      required: true,
    },
    amount: { type: Number, required: true }, // FCFA
    description: String,
    reference: String, // invoice/receipt number
    paymentMethod: {
      type: String,
      enum: ["Espèces", "Virement", "Chèque"],
    },
    status: {
      type: String,
      enum: ["En attente", "Confirmée", "Annulée"],
      default: "En attente",
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
