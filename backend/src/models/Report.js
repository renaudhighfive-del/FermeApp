import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    reportType: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Campaign"],
      required: true,
    },
    period: {
      startDate: Date,
      endDate: Date,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      sparse: true,
    },
    metrics: {
      totalAnimals: Number,
      totalDeaths: Number,
      mortalityRate: Number,
      feedConsumed: Number,
      totalExpense: Number,
      totalRevenue: Number,
      fcr: Number,
      profitMargin: Number,
    },
    highlights: [String],
    recommendations: [String],
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
