const mongoose = require('mongoose');

const collection = 'users';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    area: {
      type: String,
    },
    country: {
      type: String,
    },
    postalCode: {
      type: String,
    },
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
      unique: true,
    },
  },
  // Confirm Payment Methods later
  paymentProviders: {
    stripe: {
      type: String,
    },
  },
  paymentMethods: {
    provider: {
      type: String,
      enum: ['Stripe', 'PayPal', 'Square'],
    },
    type: {
      type: String,
      enum: ['card', 'bank_account', 'digital_wallet'],
    },
    id: {
      type: String,
    },
    details: {
      last4: {
        type: String,
      },
      brand: {
        type: String,
      },
      expiryMonth: {
        type: Number,
        min: 1,
        max: 12,
      },
      expiryYear: {
        type: Number,
      },
    },
  },
  isDeleted: {
    type: Boolean,
  },
});

userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema, collection);

module.exports = { User };
