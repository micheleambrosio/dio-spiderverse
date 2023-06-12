import { NextResponse } from "next/server";

import data from "./heroes.json";

export async function GET() {
  return NextResponse.json({ data });
}
