import prismadb from "@/lib/prismadb";

export default async function getProducts() {
  try {
    const products = await prismadb.product.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error: any) {
    throw new Error(`Error fetching products: ${error.message}`);
  } finally {
    await prismadb.$disconnect();
  }
}
