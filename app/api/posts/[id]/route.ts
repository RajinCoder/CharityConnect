import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    console.log("Delete check - Post userId:", post.userId, "User id:", user.id);
    console.log("Delete check - Post accountName:", post.accountName, "User name:", user.name);

    const isOwner = post.userId === user.id 
    if (!isOwner) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
