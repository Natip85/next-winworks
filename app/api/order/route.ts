import prismadb from "@/lib/prismadb";
import { FulfillmentStatusLabel } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const orders = await prismadb.order.findMany();
  const orderLength = orders.length;

  const order = await prismadb.order.create({
    data: {
      ...body,
      orderNumber: "US" + orderLength,
    },
  });

  return NextResponse.json(order);
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const order = await prismadb.order.update({
    where: { id: body.id },
    data: {
      fulfillmentStatus: FulfillmentStatusLabel.FULFILLED,
    },
  });

  return NextResponse.json(order);
}
