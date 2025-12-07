/**
 * Migration script to add userId to existing posts
 * Run this once to update old posts that don't have userId
 */

import dbConnect from "../lib/mongoose";
import Post from "../models/Post";
import User from "../models/User";

async function migratePostUserIds() {
  try {
    await dbConnect();
    console.log("Connected to database");

    // Find all posts that don't have userId
    const postsWithoutUserId = await Post.find({
      $or: [{ userId: { $exists: false } }, { userId: "" }],
    });

    console.log(`Found ${postsWithoutUserId.length} posts without userId`);

    let updated = 0;
    let failed = 0;

    for (const post of postsWithoutUserId) {
      try {
        // Try to find user by accountName
        const user = await User.findOne({ name: post.accountName });

        if (user) {
          post.userId = user._id.toString();
          await post.save();
          updated++;
          console.log(
            `✓ Updated post ${post._id} with userId ${user._id} (${user.name})`
          );
        } else {
          failed++;
          console.log(
            `✗ Could not find user for post ${post._id} with accountName: ${post.accountName}`
          );
        }
      } catch (error) {
        failed++;
        console.error(`✗ Error updating post ${post._id}:`, error);
      }
    }

    console.log("\nMigration complete!");
    console.log(`Updated: ${updated} posts`);
    console.log(`Failed: ${failed} posts`);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migratePostUserIds();
