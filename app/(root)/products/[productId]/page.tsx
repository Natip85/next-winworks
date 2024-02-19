import { getProductById } from "@/actions/getProductById";
import { getVariants } from "@/actions/getVariants";
import AddProductForm from "@/components/product/AddProductForm";

interface ProductPageProps {
  params: {
    productId: string;
  };
}
const Product = async ({ params }: ProductPageProps) => {
  const product = await getProductById(params.productId);
  const variants = await getVariants(product?.id || "");

  return (
    <div>
      <AddProductForm product={product} variants={variants} />
    </div>
  );
};

export default Product;
