import xlsx, { IJsonSheet } from "json-as-xlsx";

export function downloadToExcel(data: any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Products",
      columns: [
        { label: "Customer name", value: "name" },
        { label: "Customer email", value: "email" },
        { label: "Location", value: "location" },
        { label: "Orders", value: "orders" },
        { label: "Amount spent", value: "totalSpent" },
      ],
      content: data.map(
        (customer: any) => (
          console.log("CUSTOMER>>>", customer),
          {
            ...customer,
            orders: customer.orders.length,
            totalSpent: customer.orders.map((order: any) =>
              console.log("THIS?", order.totalPrice / 100)
            ),
          }
        )
      ),
    },
  ];

  let settings = {
    fileName: "Customers Excel",
  };

  xlsx(columns, settings);
}
