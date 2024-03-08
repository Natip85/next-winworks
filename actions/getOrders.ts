import prismadb from "@/lib/prismadb";

export default async function getOrders() {
  try {
    const orders = await prismadb.order.findMany({
      include: {
        user: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders;
  } catch (error: any) {
    throw new Error(`Error fetching orders: ${error.message}`);
  } finally {
    await prismadb.$disconnect();
  }
}
