import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product = await prismadb.product.create({
      data: {
        ...body,
      },
    });

    const productOptions = body.options;
    console.log(productOptions);
    const generateVariants = (productOptions: any) => {
      const variants: any = [];
      const optionValues = productOptions.map((option: any) => option.values);

      const generateCombinations = (index: any, combination: any) => {
        if (index === optionValues.length) {
          variants.push({
            title: `${product.title} - ${combination.join(" - ")}`,
            options: productOptions.map((option: any, i: any) => ({
              name: option.name,
              value: combination[i],
            })),
            price: 0,
            comparePriceAt: 0,
            available: product.available,
            requiresShipping: true,
            sku: "",
            weight: 0,
            weightUnit: "lb",
            inventoryQuantity: 0,
          });
          return;
        }
        for (const value of optionValues[index]) {
          generateCombinations(index + 1, [...combination, value]);
        }
      };

      generateCombinations(0, []);
      return variants;
    };
    const variants = generateVariants(productOptions);

    for (const variant of variants) {
      await prismadb.variant.create({
        data: {
          ...variant,
          parentId: product.id,
        },
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.log("Error at /api/product POST", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
