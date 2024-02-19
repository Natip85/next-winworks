import xlsx, { IJsonSheet } from "json-as-xlsx";

export function downloadToExcel(data: any) {
  console.log("DATA>>>", data);
  const imgUrl = data.images.map((img: any) => {
    return imgUrl.url;
  });
  let columns: IJsonSheet[] = [
    {
      sheet: "Products",
      columns: [
        { label: "Product ID", value: "id" },
        { label: "Product Image", value: "images" },
        { label: "Product Name", value: "title" },
        { label: "Product Description", value: "description" },
        { label: "Product Category", value: "category" },
        { label: "Product Status", value: "status" },
        { label: "Product Inventory", value: "totalInventory" },
        { label: "Product Price", value: "price" },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "Products Excel",
  };

  xlsx(columns, settings);
}
