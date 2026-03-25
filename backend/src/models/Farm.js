import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    managers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalArea: { type: Number }, // in hectares
    productionTypes: [String], // ['Volaille', 'Bétail', 'Pisciculture']
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Farm", farmSchema);
