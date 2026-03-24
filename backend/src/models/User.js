import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema(
 {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 6,
      select: false, 
    },
    role: {
      type: String,
      enum: ['admin', 'gerant', 'agent'],
      default: 'agent',
    },
    // Fermes assignées (pour gérants et agents)
    farms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
      },
    ],
    // Campagnes assignées (pour gérants et agents)
    campaignsAssignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
      },
    ],
    actif: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);
