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
    // Pour le gérant : quelles fermes il gère
    fermesAssignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ferme',
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
