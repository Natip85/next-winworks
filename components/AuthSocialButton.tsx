import { cn } from "@/lib/utils";
import React from "react";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
  title?: string;
}

const AuthSocialButton = ({
  icon: Icon,
  onClick,
  title,
}: AuthSocialButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-[300px] sm:w-[400px] justify-center items-center rounded-md bg-gray-100 py-4 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 `}
    >
      <Icon className="mr-2" />
      {title}
    </button>
  );
};

export default AuthSocialButton;
