import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { registerId: string } }
) {
  try {
    const body = await request.json();

    if (!params.registerId) {
      return new NextResponse("registerId is required", { status: 400 });
    }
    const customer = await prismadb.user.update({
      where: {
        id: params.registerId,
      },
      data: { ...body, name: body.firstName + " " + body.lastName },
      include: {
        orders: true,
        reviews: true,
        accounts: true,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log("Error at /api/register/registerId PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { registerId: string } }
) {
  try {
    if (!params.registerId) {
      return new NextResponse("customerId is required", { status: 400 });
    }
    const customer = await prismadb.user.delete({
      where: {
        id: params.registerId,
      },
    });
    return NextResponse.json(customer);
  } catch (error) {
    console.log("Error at /api/register/registerId DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
