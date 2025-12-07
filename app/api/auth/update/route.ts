import User from "@/models/User";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

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

        //create new
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ 
            name: newName,
            email: user.email,
            userType: user.userType 
        })
            .setProtectedHeader({ alg: "HS256" })
            .setSubject(user._id.toString())
            .setExpirationTime("7d")
            .sign(secret);

        //updating
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({ message: "User updated successfully" });
    } catch (err) {
        console.error("Update error:", err);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}