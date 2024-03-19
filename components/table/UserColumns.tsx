"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Order, User } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Clipboard, EyeIcon, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import axios from "axios";
import Modal from "../Modal";

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "",
    id: "id",
  },
  {
    header: "Customer name",
    accessorKey: "name",
    cell: ({ row }) => {
      const customer = row.original;
      const customerId = customer.id;
      const allCustomers: string = row.getValue("name");
      return (
        <Link
          href={`/customers/${customerId}`}
          className="font-semibold hover:underline "
        >
          <span>{allCustomers}</span>
        </Link>
      );
    },
  },
  {
    header: "Customer email",
    accessorKey: "email",
    cell: ({ row }) => {
      const allCustomers: string = row.getValue("email");
      return <span>{allCustomers}</span>;
    },
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => {},
  },
  {
    header: "Orders",
    accessorKey: "orders",
    cell: ({ row }) => {
      const allOrders: Order[] = row.getValue("orders");
      return <span>{allOrders.length}</span>;
    },
  },
  {
    header: "Amount spent",
    accessorKey: "totalSpent",
    cell: ({ row }) => {
      const totalPriceArray = row.original.orders.map(
        (order: any) => order.totalPrice
      );
      const totalPriceSum = totalPriceArray.reduce(
        (total: number, current: number) => total + current,
        0
      );
      const formattedTotalPriceSum = totalPriceSum / 100;
      return <div>{formatPrice(formattedTotalPriceSum)}</div>;
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const customerId = customer.id;
      const handleCustomerDelete = async (id: string) => {
        try {
          await axios.delete(`/api/register/${id}`);
          window.location.reload();
        } catch (error: any) {
          console.log(error);
        }
      };
      return (
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" className="w-8 h-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Separator />
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(customer.id);
                }}
                className="hover:cursor-pointer"
              >
                <Clipboard className="h-4 w-4 mr-2" />
                Copy customers name
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/customers/${customerId}`}
                  className="flex items-center"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View customer
                </Link>
              </DropdownMenuItem>

              <Modal
                onConfirm={() => handleCustomerDelete(customer.id)}
                icon={<Trash2 className="h-4 w-4 mr-2" />}
                triggerTitle="Delete customer"
                cancelTitle="Cancel"
                confirmTitle="Delete customer"
                title={`Delete ${customer.name}?`}
                description={`Are you sure you want to delete ${customer.name}? This can't be undone.`}
                btnClasses="w-full h-[30px] rounded-md bg-transparent font-normal text-sm text-black flex items-center h-[30px] pl-2 hover:bg-slate-100"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
