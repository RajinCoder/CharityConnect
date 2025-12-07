import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const zipCode = searchParams.get("zipCode");

    if (!zipCode) {
      return NextResponse.json({ error: "Zip code is required" }, { status: 400 });
    }

    await dbConnect();

    const charities = await User.find({
      userType: "charity",
      "address.zipCode": zipCode,
      "address.coordinates.lat": { $exists: true },
      "address.coordinates.lng": { $exists: true },
    })
      .select("name email address")
      .lean();

    const plainCharities = JSON.parse(JSON.stringify(charities));

    return NextResponse.json({ charities: plainCharities });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search charities" }, { status: 500 });
  }
}
