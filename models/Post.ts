import mongoose from "mongoose";

const commitmentItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  needed: { type: Number, required: true },
  committed: { type: Number, default: 0 },
  icon: { type: String, default: "box" },
});

const commitmentSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  itemName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
});

const postSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, required: true },
  accountName: { type: String, required: true },
  userId: { type: String, required: true },
  commitmentItems: [commitmentItemSchema],
  commitments: [commitmentSchema],
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
