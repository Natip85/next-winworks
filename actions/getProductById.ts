import prismadb from "@/lib/prismadb";
import { ObjectId } from "mongodb";

export const getProductById = async (productId: string) => {
  const newProductId = new ObjectId().toHexString();
  try {
    const product = await prismadb.product.findUnique({
      where: {
        id: productId === "new" ? newProductId : productId,
      },
      include: {
        variants: true,
        reviews: true,
      },
    });

    if (!product) return null;

    return product;
  } catch (error: any) {
    throw new Error(error);
  }
};
