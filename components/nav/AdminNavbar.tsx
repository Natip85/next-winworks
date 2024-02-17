"use client";
import Image from "next/image";
import SearchInput from "../SearchInput";
import NavMenu from "./NavMenu";
import { useRouter } from "next/navigation";
import Container from "../Container";
interface AdminNavbarProps {
  currentUser: any | null;
}
const AdminNavbar = ({ currentUser }: AdminNavbarProps) => {
  const router = useRouter();
  return (
    <div className="fixed z-50 top-0 right-0 left-0 bg-black">
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/home")}
          >
            <Image
              src={"/logo.svg"}
              alt="logo"
              width="30"
              height="30"
              className="aspect-square"
            />
            <div className={"font-bold text-xl  text-white"}>NextWinWorks</div>
          </div>
          <div className="hidden md:block">
            <SearchInput />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <NavMenu currentUser={currentUser} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminNavbar;
