import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(request: Request) { 
    try {
        const { unFollowerId, followeeId } = await request.json();
        console.log("UNFollow request:", { unFollowerId, followeeId });
        await dbConnect(); 

        await User.findByIdAndUpdate(unFollowerId, { $pull: { following: followeeId } });
        await User.findByIdAndUpdate(followeeId, { $pull: { followers: unFollowerId } });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.log("Unfollow error:", error);
        return new Response(JSON.stringify({ error: "Failed to unfollow user" }), { status: 500 });
    }
}