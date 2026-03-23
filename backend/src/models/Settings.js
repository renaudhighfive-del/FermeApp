import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    companyName: String,
    companyLogo: String,
    currency: { type: String, default: "FCFA" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    language: { type: String, enum: ["fr", "en"], default: "fr" },
    notifications: {
      emailAlerts: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
    },
    api: {
      allowExternalAccess: Boolean,
      apiKeys: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
