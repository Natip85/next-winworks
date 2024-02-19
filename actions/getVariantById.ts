import prismadb from "@/lib/prismadb";

export const getVariantById = async (variantId: string) => {
  try {
    const variant = await prismadb.variant.findUnique({
      where: {
        id: variantId,
      },
      include: {
        product: true,
      },
    });

    if (!variant) return null;

    return variant;
  } catch (error: any) {
    throw new Error(error);
  }
};
