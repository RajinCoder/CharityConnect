import User from "@/models/User";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) { 
    try {
        await dbConnect();
        const {email, newName} = await request.json();
        
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        await User.updateOne({ email }, {$set: { name: newName } } );

        return NextResponse.json({ message: "User updated successfully" });
    } catch (err) {
        console.error("Update error:", err);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}