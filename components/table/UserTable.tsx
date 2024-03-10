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
import { Search } from "lucide-react";
import { downloadToExcel } from "@/app/api/register/xlsx";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
function UserTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [showSearch, setShowSearch] = useState(false);

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

  return (
    <div className="m-auto max-w-[380px] sm:max-w-[600px] lg:max-w-full">
      <div>
        <div className="bg-white p-2 rounded-tl-lg rounded-tr-lg border-[1px] border-slate-300 border-b-0 shadow-md transition">
          {showSearch ? (
            <div className="flex justify-between transition">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  id="user-table"
                  placeholder="Filter Users"
                  value={
                    (table.getColumn("email")?.getFilterValue() as string) || ""
                  }
                  onChange={(e) => {
                    table.getColumn("email")?.setFilterValue(e.target.value);
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
          <Table className="bg-white">
            <TableHeader className="bg-gray-100">
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
                  <TableRow key={row.id} className="h-[50px]">
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

export default UserTable;
