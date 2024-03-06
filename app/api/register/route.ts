import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { addresses, name, lastName, email, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const nameParts = name.split(" ");
  const user = await prisma.user.create({
    data: {
      hashedPassword,
      name: name + " " + lastName,
      firstName: name,
      lastName,
      email,
      addresses,
    },
  });

  return NextResponse.json(user);
}
