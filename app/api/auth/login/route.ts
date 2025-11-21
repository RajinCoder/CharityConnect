import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { SignJWT } from "jose";


export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials." }),
        { status: 400 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const jwt = await new SignJWT({ sub: user._id.toString(), email: user.email, name: user.name })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Set-Cookie": `token=${jwt}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict; Secure`,
        },
    });

  } catch (error) {
    console.log("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500 }
    );
  }
}