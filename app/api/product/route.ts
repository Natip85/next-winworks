import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract options from the request body
    const { options, ...productData } = body;

    // Create a product using the remaining data
    const product = await prismadb.product.create({
      data: {
        ...productData,
        options: options,
      },
    });

    // Create a variant for each option
    const variantPromises = options.map(async (option: { name: string }) => {
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
    });

    // Wait for all variant creations to complete
    await Promise.all(variantPromises);

    return NextResponse.json(product);
  } catch (error) {
    console.log("Error at /api/product POST", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
