import prisma from "@/lib/prismadb";
import { FulfillmentStatusLabel } from "@prisma/client";
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

export async function PATCH(request: Request) {
  const body = await request.json();

  const order = await prisma.order.update({
    where: { id: body.id },
    data: {
      fulfillmentStatus: FulfillmentStatusLabel.FULFILLED,
    },
  });

  return NextResponse.json(order);
}
