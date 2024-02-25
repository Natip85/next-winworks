import prismadb from "@/lib/prismadb";
import { ObjectId } from "mongodb";

export const getOrderById = async (orderId: string) => {
  const newOrderId = new ObjectId().toHexString();
  try {
    const order = await prismadb.order.findUnique({
      where: {
        id: orderId === "new" ? newOrderId : orderId,
      },
      include: {
        user: true,
      },
    });

    if (!order) return null;

    return order;
  } catch (error: any) {
    throw new Error(error);
  }
};
