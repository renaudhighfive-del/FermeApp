import mongoose from "mongoose";

const transferLogSchema = new mongoose.Schema(
  {
    sourceFarm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    targetFarm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      enum: ["dry-run", "execute"],
      default: "execute",
    },
    impact: {
      campaigns: { type: Number, default: 0 },
      products: { type: Number, default: 0 },
      transactions: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      reports: { type: Number, default: 0 },
    },
    transferredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TransferLog", transferLogSchema);
