const mongoose = require('mongoose');

const archiveStoreSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    managerName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    contactDetails: {
      phone: {
        countryCode: {
          type: String,
          required: true,
        },
        number: {
          type: String,
          required: true,
        },
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please enter a valid email address',
        ],
      },
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    operatingHours: [
      {
        day: {
          type: String,
          enum: [
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
            'SUNDAY',
          ],
          required: true,
        },
        open: {
          type: String,
          required: true,
          match: [
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            'Please enter time in HH:MM format',
          ],
        },
        close: {
          type: String,
          required: true,
          match: [
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            'Please enter time in HH:MM format',
          ],
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

archiveStoreSchema.index({ location: '2dsphere' });
const ArchiveStore = mongoose.model('ArchiveStore', archiveStoreSchema);
module.exports = ArchiveStore;
