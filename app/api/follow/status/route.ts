/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const followerId = searchParams.get("followerId");
  const followeeId = searchParams.get("followeeId");

  if (!followerId || !followeeId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await dbConnect();
  
  const follower = await User.findById(followerId).lean() as {
    following?: string[];
  } | null;
  
  const isFollowing = follower?.following?.some(
    (id: any) => id.toString() === followeeId
  ) ?? false;

  return NextResponse.json({ isFollowing });
}