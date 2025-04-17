const mongoose = require('mongoose');

const collection = 'internalUsers';

const interalUsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        // Check if the email ends with @peekabox.co
        return /@peekabox\.co$/.test(email);
      },
      message: (props) =>
        `${props.value} is not a valid company email address!`,
    },
  },
  passwordHash: { type: String, required: true },
  tokenVersion: { type: Number, default: 0 },
});

interalUsersSchema.index({ email: 1 });

interalUsersSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.tokenVersion;
  return obj;
};

const InternalUser = mongoose.model(
  'InternalUser',
  interalUsersSchema,
  collection,
);

module.exports = { InternalUser };
