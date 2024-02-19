import prismadb from "@/lib/prismadb";
import { ObjectId } from "mongodb";

export const getVariants = async (productId: string) => {
  const newVariantId = new ObjectId().toHexString();
  try {
    const variants = await prismadb.variant.findMany({
      where: {
        parentId: productId === "" ? newVariantId : productId,
      },
    });
    return variants;
  } catch (error: any) {
    throw new Error(error);
  }
};
