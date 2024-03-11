import ProfileMenu from "@/components/ProfileMenu";
import { UserCircle2 } from "lucide-react";

const Addresses = () => {
  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-6 pt-5">
        <span className="bg-teal-50 flex h-12 w-12 items-center justify-center rounded-full">
          <div>
            <UserCircle2 className="text-teal-700" />
          </div>
        </span>
        <h2 className="text-xl md:text-4xl font-semibold">My account</h2>
      </div>
      <div className="mt-4 flex flex-col-reverse px-4 pb-20 lg:mt-8 lg:flex-row xl:pb-80">
        <ProfileMenu />
        <div className="w-full lg:mt-3 lg:box-border lg:w-[calc(100%-300px)] lg:pl-12 mt-7 md:mt-2">
          <h2 className="font-semibold mb-1 md:mb-3">Hi, efreyhtrujfyjydf!</h2>
          <p className="text-sm font-light">
            We&apos;re so happy to have you as part of the Nanobebe family!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
