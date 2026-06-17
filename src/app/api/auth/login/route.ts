import { NextResponse } from "next/server";
import accounts from "@/data/accounts.json";

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required fields." },
        { status: 400 }
      );
    }

    const emailClean = email.trim().toLowerCase();
    const user = accounts.find(
      (acc) =>
        (acc.email.toLowerCase() === emailClean || acc.id.toLowerCase() === emailClean) &&
        acc.password === password &&
        acc.role === role
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    // Return profile omitting the password
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
