import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface CustomModalProps {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  icon?: ReactNode;
  triggerTitle?: string;
  btnClasses?: string;
  confirmTitle?: string;
  cancelTitle?: string;
}

const Modal = ({
  title,
  description,
  onConfirm,
  icon,
  triggerTitle,
  btnClasses,
  confirmTitle,
  cancelTitle,
}: CustomModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={btnClasses} onClick={toggleModal}>
          {icon}
          {triggerTitle}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[900px] w-[90%]">
        <DialogHeader>
          <DialogTitle className="my-3">{title}</DialogTitle>
          <Separator />
          <DialogDescription className="py-5 text-black">
            {description}
          </DialogDescription>
          <Separator />
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              size={"sm"}
              variant={"outline"}
              className="h-[30px]"
              onClick={toggleModal}
            >
              {cancelTitle}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            size={"sm"}
            onClick={() => {
              onConfirm?.();
              toggleModal();
            }}
            className="h-[30px]"
          >
            {confirmTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
