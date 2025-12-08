import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const user = await getCurrentUser();
    const incoming = Array.isArray(body.commitmentItems) ? body.commitmentItems : [];
    const commitmentItems = incoming.map((entry: any) => {
      if (typeof entry === "string") {
        const name = entry;
        return {
          //Replace spaces with dashes and lowercase for itemId
          itemId: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          needed: 1,
          committed: 0,
          icon: "box",
        };
      }

      const name = entry.name || String(entry);
      const needed = Number(entry.needed) || 1;
      return {
        //Replace spaces with dashes and lowercase for itemId
        itemId: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        needed,
        committed: 0,
        icon: entry.icon || "box",
      };
    });

    const postPayload = {
      imageUrl: body.imageUrl || "",
      caption: body.caption || "",
      accountName: user?.name || "",
      userId: user?.id || "",
      commitmentItems,
      commitments: body.commitments || [],
      date: body.date || new Date().toISOString(),
    };

    const post = await Post.create(postPayload);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
