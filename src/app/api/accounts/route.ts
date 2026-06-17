import { NextResponse } from "next/server";
import accounts from "@/data/accounts.json";

export async function GET() {
  try {
    // Return all profiles omitting password fields
    const safeAccounts = accounts.map(({ password, ...safe }) => safe);
    return NextResponse.json(safeAccounts);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
