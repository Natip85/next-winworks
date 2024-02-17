import { User } from "lucide-react";
import Image from "next/image";

interface AvatarProps {
  src?: string | null | undefined;
  currentUser?: any;
}

const NavbarAvatar = ({ src, currentUser }: AvatarProps) => {
  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        className="rounded"
        height={35}
        width={35}
      />
    );
  }
  return (
    <div className="bg-white rounded">
      <User size={35} />
    </div>
  );
};

export default NavbarAvatar;
