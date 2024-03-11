"use client";
import { CopyPlusIcon } from "lucide-react";
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
    </div>
  );
};

export default HistoryClient;
