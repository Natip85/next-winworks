"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import moment from "moment";
import { formatPrice } from "@/lib/utils";
import { Badge } from "../ui/badge";

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
    header: "Order ID",
    id: "id",
    accessorKey: "id",
    cell: ({ row }) => {
      const order = row.original;
      const orderId = order.id;

      return (
        <span>
          <Link
            href={`/orders/${order.id}`}
            className="hover:underline font-semibold"
          >
            {orderId}
          </Link>
        </span>
      );
    },
  },
  {
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const order = row.original;
      const orderDate = order.createdAt;

      return <span>{moment(orderDate).format("M/D/Y")}</span>;
    },
  },
  {
    header: "Customer",
    accessorKey: "customer",
    cell: ({ row }) => {
      const order = row.original;
      const shippingAddress = order.shippingAddress;

      return <span>{shippingAddress?.fullName}</span>;
    },
  },
  {
    header: "Total",
    accessorKey: "totalPrice",
    cell: ({ row }) => {
      const order = row.original;
      const total = order.totalPrice;
      const finalTotal = total / 100;

      return <span>{formatPrice(finalTotal)}</span>;
    },
  },
  {
    header: "Payment status",
    accessorKey: "paymentStatus",
    cell: ({ row }) => {
      const order = row.original;
      const payStatus = order.paymentStatus;

      return (
        <span>
          <Badge variant={payStatus === "complete" ? "secondary" : "warning"}>
            {payStatus === "complete" ? "paid" : "pending"}
          </Badge>
        </span>
      );
    },
  },
];
