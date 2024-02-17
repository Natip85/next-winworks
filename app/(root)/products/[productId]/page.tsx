import { getProductById } from "@/actions/getProductById";
import AddProductForm from "@/components/product/AddProductForm";

interface ProductPageProps {
  params: {
    productId: string;
  };
}
const Product = async ({ params }: ProductPageProps) => {
  const product = await getProductById(params.productId);

  return (
    <div>
      <AddProductForm product={product} />
    </div>
  );
};

export default Product;
