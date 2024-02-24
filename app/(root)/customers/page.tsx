import getAllUsers from "@/actions/getAllUsers";
import { columns } from "@/components/table/UserColumns";
import UserTable from "@/components/table/UserTable";
import Link from "next/link";

const Customers = async () => {
  const users = (await getAllUsers()) || [];
  console.log("USERS>>>>", users);
  console.log("COLUMS<<>>>", columns);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-bold text-2xl">Customers</div>
        <Link
          href={"/customers/new"}
          className="bg-stone-800 hover:bg-black text-white rounded-lg px-4 py-1 border-2 border-gray-700 text-sm"
        >
          Add customer
        </Link>
      </div>
      <UserTable columns={columns} data={users} />
    </div>
  );
};

export default Customers;
