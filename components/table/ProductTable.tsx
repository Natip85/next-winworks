"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Trash2 } from "lucide-react";
import { downloadToExcel } from "@/app/api/product/xlsx";
import { Separator } from "../ui/separator";
import Modal from "../Modal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import axios from "axios";
import { toast, useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
function ProductTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const handleProductDelete = async (value: any) => {
    try {
      const idsToDelete = value.map((prod: any) => {
        return prod.id;
      });
      await axios
        .delete("/api/product/deletemany", {
          data: { productIds: idsToDelete },
        })
        .then((res) => {
          toast({
            variant: "success",
            description:
              table.getFilteredSelectedRowModel().rows.length > 1
                ? "Products deleted"
                : "Product deleted",
          });
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
      const imageKeys: string[] = [];

      value.forEach((prod: any) => {
        prod.images.forEach((imgKey: any) => {
          imageKeys.push(imgKey.key);
        });
      });

      await axios.post("/api/uploadthing/delete", { imageKeys: [imageKeys] });
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };
  return (
    <div className="m-auto max-w-[380px] sm:max-w-[600px] lg:max-w-full">
      <div>
        <div className="bg-white p-2 rounded-tl-lg rounded-tr-lg border-[1px] border-slate-300 border-b-0 shadow-md transition">
          {showSearch ? (
            <div className="flex justify-between transition">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  id="prod-table"
                  placeholder="Filter Products"
                  value={
                    (table.getColumn("title")?.getFilterValue() as string) || ""
                  }
                  onChange={(e) => {
                    table.getColumn("title")?.setFilterValue(e.target.value);
                  }}
                  className="mb-3 h-[30px]"
                />
                <div className="flex gap-2 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"outline"} className="h-[30px] text-xs">
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value: boolean) => {
                                column.toggleVisibility(!!value);
                              }}
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    onClick={() => downloadToExcel(data)}
                    className="h-[30px] text-xs"
                  >
                    Export
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setShowSearch(!showSearch)}
                variant={"outline"}
                className="ml-5 h-[30px]"
              >
                <Search className="w-4 h-4 mr-2" />
                <span className="text-xs">Search and filter</span>
              </Button>
            </div>
          ) : (
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="h-[30px] text-xs">
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value: boolean) => {
                              column.toggleVisibility(!!value);
                            }}
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() => downloadToExcel(data)}
                  className="h-[30px] text-xs"
                >
                  Export
                </Button>
              </div>
              <Button
                onClick={() => setShowSearch(!showSearch)}
                variant={"outline"}
                className="h-[30px]"
              >
                <Search className="w-4 h-4 mr-2" />
                <span className="text-xs">Search and filter</span>
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white overflow-hidden border-[1px] border-t-0 border-slate-300 shadow-md rounded-b-lg mb-3">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="p-2 text-sm text-muted-foreground">
              <Separator className="mb-2" />
              <div className="flex items-center justify-between">
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected
                </span>
                <span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        size={"xs"}
                        className="shadow-md"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Modal
                        onConfirm={() =>
                          handleProductDelete(
                            table
                              .getFilteredSelectedRowModel()
                              .rows.map((row: any) => row.original)
                          )
                        }
                        icon={<Trash2 className="size-4 mr-2" />}
                        triggerTitle={
                          table.getFilteredSelectedRowModel().rows.length > 1
                            ? "Delete products"
                            : "delete product"
                        }
                        cancelTitle="Cancel"
                        confirmTitle={
                          table.getFilteredSelectedRowModel().rows.length > 1
                            ? "Delete products"
                            : "delete product"
                        }
                        title={`Remove ${
                          table.getFilteredSelectedRowModel().rows.length
                        } products?`}
                        description="This can't be undone."
                        btnClasses="w-full text-sm flex items-center"
                      />
                    </PopoverContent>
                  </Popover>
                </span>
              </div>
            </div>
          )}
          <Table className="bg-white p-5">
            <TableHeader className="bg-gray-100 p-5">
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 py-1">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>No results</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* pagination */}
      <div className="">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default ProductTable;
