import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const body = await request.json();

    if (!params.productId) {
      return new NextResponse("ProductID is required", { status: 400 });
    }
    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: { ...body },
      include: {
        variants: true,
      },
    });

    const existingVariants = await prismadb.variant.findMany({
      where: {
        parentId: params.productId,
      },
    });
    const missingVariants = existingVariants.filter((variant) =>
      body.options.every(
        (option: { name: string }) => variant.title !== option.name
      )
    );

    const additionalVariants = body.options.filter((option: { name: string }) =>
      existingVariants.every((variant) => variant.title !== option.name)
    );

    const variantPromises = additionalVariants.map(
      async (option: { name: string }) => {
        return prismadb.variant.create({
          data: {
            title: option.name,
            price: 0,
            comparePriceAt: 0,
            available: product.available,
            images: undefined,
            requiresShipping: product.requiresShipping,
            sku: "",
            weight: 0,
            weightUnit: "lb",
            inventoryQuantity: 0,
            parentId: product.id,
          },
        });
      }
    );

    await Promise.all(variantPromises);

    const deletePromises = missingVariants.map(async (variant) => {
      return prismadb.variant.deleteMany({
        where: {
          id: variant.id,
        },
      });
    });

    await Promise.all(deletePromises);

    return NextResponse.json(product);
  } catch (error) {
    console.log("Error at /api/product/productId PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }
    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("Error at /api/product/productId DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
