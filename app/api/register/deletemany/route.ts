import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { customerIds } = await request.json();
    console.log("RECEIVED IDS>>>", customerIds);

    if (!customerIds || !customerIds.length) {
      return new NextResponse("customer IDs are required", { status: 400 });
    }
    const deletedCustomers: any = [];
    for (const customerId of customerIds) {
      await prismadb.user.delete({
        where: {
          id: customerId,
        },
      });
    }

    return NextResponse.json(deletedCustomers);
  } catch (error) {
    console.log("Error at /api/register/deletemany DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
