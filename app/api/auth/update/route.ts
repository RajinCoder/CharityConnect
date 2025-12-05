import User from "@/models/User";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) { 
    try {
        await dbConnect();
        const {email, newName} = await request.json();
        const user = await User.findOne({ email });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found." }),
                { status: 404 }
            );
        }

        const result = await User.updateOne({ email }, {$set: { name: newName } } );
        console.log('Update result:', result);
        return NextResponse.json({ message: "User updated successfully" });
    } catch (err) {
  console.error(err);
}
}