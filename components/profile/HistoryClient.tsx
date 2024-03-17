"use client";
import { formatPrice } from "@/lib/utils";
import { CopyPlusIcon } from "lucide-react";
import moment from "moment";
interface HistoryClientProps {
  user: any;
}
const HistoryClient = ({ user }: HistoryClientProps) => {
  console.log("USER>>", user);

  return (
    <div>
      {user.orders.length === 0 && (
        <div className="flex items-center justify-center gap-4 mb-6 pt-5">
          <span className="bg-gray-100 flex size-20 items-center justify-center rounded-full">
            <div>
              <CopyPlusIcon className="text-teal-700" />
            </div>
          </span>
          <h2 className="text-xl">You haven&apos;t placed any orders yet.</h2>
        </div>
      )}
      {user.orders.length > 0 && (
        <div className="mt-6 overflow-scroll lg:mt-4">
          <div className="flex min-w-full border-b py-3 font-bold">
            <div className="flex-1 px-4 w-[150px] min-w-[150px]">Order</div>
            <div className="flex-1 px-4 w-[150px] min-w-[150px]">Date</div>
            <div className="flex-1 px-4 w-[150px] min-w-[150px]">
              Payment Status
            </div>
            <div className="flex-1 px-4 w-[150px] min-w-[150px]">
              Fullfillment Status
            </div>
            <div className="flex-1 px-4 w-[150px] min-w-[150px] flex-grow text-right">
              Total
            </div>
          </div>
          <ul>
            {user?.orders?.map((order: any) => (
              <li key={order.id} className="flex min-w-full border-b py-7">
                <div className="flex-1 px-4 w-[150px] min-w-[150px] overflow-y-auto">
                  {order.orderNumber}
                </div>
                <div className="flex-1 px-4 w-[150px] min-w-[150px]">
                  {moment(order?.createdAt).format("MMMM Do YYYY")}
                </div>
                <div className="flex-1 px-4 w-[150px] min-w-[150px]">
                  {order?.paymentStatus}
                </div>
                <div className="flex-1 px-4 w-[150px] min-w-[150px]">
                  {order?.fulfillmentStatus}
                </div>
                <div className="flex-1 px-4 w-[150px] min-w-[150px] flex-grow text-right">
                  {formatPrice(order?.totalPrice / 100)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistoryClient;
