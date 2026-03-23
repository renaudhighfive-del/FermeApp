import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Aliment", "Médicament", "Équipement", "Autre"],
      required: true,
    },
    sku: { type: String, unique: true, sparse: true },
    quantity: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    unitPrice: { type: Number, required: true }, // FCFA
    supplier: String,
    lastRestockDate: Date,
    expiryDate: Date,
    totalValue: { type: Number, default: 0 }, // quantity * unitPrice
  },
  { timestamps: true }
);

// Auto-calculate totalValue
productSchema.pre("save", function (next) {
  this.totalValue = this.quantity * this.unitPrice;
  next();
});

export default mongoose.model("Product", productSchema);
