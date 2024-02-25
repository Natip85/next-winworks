"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Order, User } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

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
];
