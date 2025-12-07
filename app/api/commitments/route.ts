import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, userName, commitments } = body;

    if (!postId || !commitments || !Array.isArray(commitments)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await dbConnect();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

    for (const c of commitments) {
      if (!c.itemId || !c.amount || c.amount <= 0) continue;

      const item = post.commitmentItems.find(
        (it: any) => String(it.itemId) === String(c.itemId)
      );
      
      if (!item) continue;

      const remaining = Math.max(0, item.needed - item.committed);
      const add = Math.min(remaining, Math.floor(c.amount));
      
      if (add <= 0) continue;

      item.committed = (item.committed || 0) + add;

      post.commitments.push({
        userName: userName,
        itemName: item.name,
        amount: add,
        date: now,
      });
    }

    await post.save();

    return NextResponse.json(post);
  } catch (error) {
    console.error("commitments route error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
