import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("BODY>>", body);

  const { firstName, lastName, name, email, password, addresses, phone } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      hashedPassword,
      name: firstName,
      firstName,
      lastName,
      email,
      phone,
      addresses,
    },
  });

  return NextResponse.json(user);
}
