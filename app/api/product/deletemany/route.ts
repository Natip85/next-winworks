import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { productIds } = await request.json();

    if (!productIds || !productIds.length) {
      return new NextResponse("Product IDs are required", { status: 400 });
    }
    const deletedProducts: any = [];
    for (const productId of productIds) {
      await prismadb.product.delete({
        where: {
          id: productId,
        },
      });
    }

    return NextResponse.json(deletedProducts);
  } catch (error) {
    console.log("Error at /api/product/deletemany DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
