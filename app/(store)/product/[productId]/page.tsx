import { getProductById } from "@/actions/getProductById";
import { getVariants } from "@/actions/getVariants";
import NullData from "@/components/NullData";
import ProductDetails from "@/components/product/ProductDetails";

interface IParams {
  productId?: string;
}

const Product = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params.productId || "");
  const variant = await getVariants(params.productId || "");

  if (!product) {
    return <NullData title="Product does not exist" />;
  }
  return <ProductDetails product={product} variant={variant} />;
};

export default Product;
