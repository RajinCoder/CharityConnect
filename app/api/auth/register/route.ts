import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { SignJWT } from "jose";


const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        await dbConnect();

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'User already exists.' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        console.log("New user registered:", newUser);

        const jwt = await new SignJWT({ sub: newUser._id.toString(), email: newUser.email, name: newUser.name })
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setIssuedAt()
            .setExpirationTime("2h")
            .sign(secret);


        return new Response(JSON.stringify({ success: true }), {
            status: 201,
            headers: {
                "Set-Cookie": `token=${jwt}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict; Secure`,
            },
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500 });
    }
}