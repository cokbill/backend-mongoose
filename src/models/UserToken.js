const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, requierd: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expire: 30 * 86400 }, //30 days
});

const UserToken = mongoose.model("UserToken", userTokenSchema);

module.exports = UserToken;