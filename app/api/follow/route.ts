import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(request: Request) { 
    try {
        const { followerId, followeeId } = await request.json();
        console.log("Follow request:", { followerId, followeeId });
        await dbConnect(); 

        await User.findByIdAndUpdate(followerId, { $addToSet: { following: followeeId } });
        await User.findByIdAndUpdate(followeeId, { $addToSet: { followers: followerId } });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.log("Follow error:", error);
        return new Response(JSON.stringify({ error: "Failed to follow user" }), { status: 500 });
    }
}