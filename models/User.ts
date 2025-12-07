import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["user", "charity"], default: "user" },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    formattedAddress: { type: String },
    placeId: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
