import prismadb from "@/lib/prismadb";

export default async function getAllUsers() {
  console.log("test");

  try {
    const users = await prismadb.user.findMany({
      include: {
        orders: true,
        reviews: true,
        accounts: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!users) {
      return null;
    }
    return users;
  } catch (error: any) {
    return null;
  }
}
