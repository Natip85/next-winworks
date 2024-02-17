// import getProducts from "@/actions/getProducts";
// import ProductTable from "@/components/tables/ProductTable";
import Link from "next/link";
// import { columns } from "../../../components/tables/ProductColumns";

const Products = async () => {
  // const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-bold text-2xl">Products</div>
        <Link
          href={"/products/new"}
          className="bg-stone-800 hover:bg-black text-white rounded-lg px-4 py-1 border-2 border-gray-700 text-sm"
        >
          Add product
        </Link>
      </div>
      product table
      {/* <ProductTable columns={columns} data={products} /> */}
    </div>
  );
};

export default Products;
