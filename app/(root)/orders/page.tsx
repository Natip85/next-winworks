import getOrders from "@/actions/getOrders";
import { columns } from "@/components/table/OrderColumns";
import OrderTable from "@/components/table/OrderTable";
import Link from "next/link";

const Orders = async () => {
  const orders = (await getOrders()) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-bold text-2xl">Orders</div>
        <Link
          href={"/orders/new"}
          className="bg-stone-800 hover:bg-black text-white rounded-lg px-4 py-1 border-2 border-gray-700 text-sm"
        >
          Create order
        </Link>
      </div>
      <OrderTable columns={columns} data={orders} />
    </div>
  );
};

export default Orders;
