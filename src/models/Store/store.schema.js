const mongoose = require('mongoose');

const collection = 'stores';

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    
    brandId: {
      type: String,
      trim: true,
    },   
    description: {
      type: String,
      trim: true,
    },
    managerName: {
      type: String,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
    },
    contactDetails: {
      phone: {
        countryCode: {
          type: String,
        },
        number: {
          type: String,
        },
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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
      },
      area: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
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
        },
        open: {
          type: String,
          match: [
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            'Please enter time in HH:MM format',
          ],
        },
        close: {
          type: String,
          match: [
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            'Please enter time in HH:MM format',
          ],
        },
      },
    ],
    isDeleted: {
      type: Boolean,
    },
    deletedAt: {
      type: Date,
    },
    offersDelivery: Boolean,
  },
  {
    timestamps: true,
  },
);

storeSchema.index({ 'contactDetails.email': 1 });

storeSchema.index({ location: '2dsphere' });
const Store = mongoose.model('Store', storeSchema, collection);
module.exports = Store;
