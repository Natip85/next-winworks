"use client";

import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
interface AddCustomerToOrderProps {
  users: any;
  open2: boolean;
  setOpen2: (val: boolean) => void;
  setSelectedCustomer: (val: any) => void;
}
const AddCustomerToOrder = ({
  users,
  open2,
  setOpen2,
  setSelectedCustomer,
}: AddCustomerToOrderProps) => {
  return (
    <div>
      <Popover open={open2} onOpenChange={setOpen2}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            // aria-expanded={open}
            className="justify-between font-normal"
          >
            Search or create a customer
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <div className="p-3 flex items-center justify-between gap-5">
              <div className="flex-1">
                <CommandInput placeholder="Search a customer" />
              </div>
            </div>
            <div className="p-1">
              <Button
                variant={"secondary"}
                className="flex items-center gap-3 w-full"
              >
                <PlusCircle /> Create a new customer
              </Button>
              {/* <EditCustomerForm
                        user={user}
                        handleDialogOpen={handleDialogOpen}
                      /> */}
            </div>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup className="flex flex-col gap-3 h-[200px] overflow-y-auto">
              {users.map((user: any, i: number) => (
                <CommandItem key={user.id} className="cursor-pointer">
                  <div
                    className="w-full flex flex-col"
                    onClick={() => {
                      setSelectedCustomer(user);
                      setOpen2(!open2);
                    }}
                  >
                    <span className="font-normal">{user.name}</span>
                    <span className="font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddCustomerToOrder;
