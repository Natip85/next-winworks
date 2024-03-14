import getCurrentUser from "@/actions/getCurrentUser";
import ProfileAddressesForm from "@/components/profile/ProfileAddressesForm";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { UserCircle2 } from "lucide-react";

const Addresses = async () => {
  const user = await getCurrentUser();
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-center gap-4 mb-6 pt-5">
        <span className="bg-teal-50 flex h-12 w-12 items-center justify-center rounded-full">
          <div>
            <UserCircle2 className="text-teal-700" />
          </div>
        </span>
        <h2 className="text-xl md:text-4xl font-semibold">My account</h2>
      </div>
      <div className="mt-4 flex flex-col px-4 pb-20 lg:mt-8 lg:flex-row xl:pb-80">
        <ProfileMenu />
        <div className="w-full lg:mt-3 lg:box-border lg:w-[calc(100%-300px)] lg:pl-12 mt-7 md:mt-2">
          <ProfileAddressesForm user={user} />
        </div>
      </div>
    </div>
  );
};

export default Addresses;
