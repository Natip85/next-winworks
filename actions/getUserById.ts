import prismadb from "@/lib/prismadb";
import { ObjectId } from "mongodb";

export const getUserById = async (customerId: string) => {
  const newUserId = new ObjectId().toHexString();
  try {
    const user = await prismadb.user.findUnique({
      where: {
        id: customerId === "new" ? newUserId : customerId,
      },
      include: {
        orders: true,
        reviews: true,
        accounts: true,
      },
    });

    if (!user) return null;

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};
