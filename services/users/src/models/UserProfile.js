import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: String,
    lastName: String,
    phone: String,
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    bio: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ['home', 'work', 'other'],
          default: 'home',
        },
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String,
        isDefault: Boolean,
      },
    ],
    preferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      darkMode: {
        type: Boolean,
        default: false,
      },
    },
    wishlist: [String],
    totalSpent: {
      type: Number,
      default: 0,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model('UserProfile', userProfileSchema);
