import xlsx, { IJsonSheet } from "json-as-xlsx";

export function downloadToExcel(data: any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Products",
      columns: [
        { label: "Product ID", value: "id" },
        { label: "Product Image", value: "imageUrls" },
        { label: "Product Name", value: "title" },
        { label: "Product Description", value: "description" },
        { label: "Product Category", value: "productCategory" },
        { label: "Product Status", value: "status" },
        { label: "Product Inventory", value: "totalInventory" },
        { label: "Product Price", value: "price" },
      ],
      content: data.map((product: any) => ({
        ...product,
        imageUrls: product.images.map((img: any) => img.url).join(", "), // Concatenate image URLs into a single string
      })),
    },
  ];

  let settings = {
    fileName: "Products Excel",
  };

  xlsx(columns, settings);
}
