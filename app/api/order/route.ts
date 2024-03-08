import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const order = await prisma.order.create({
    data: {
      ...body,
    },
  });

  return NextResponse.json(order);
}
