import { getProductById } from "@/actions/getProductById";
import { getVariantById } from "@/actions/getVariantById";
import EditVariantForm from "@/components/product/EditVariantForm";
interface VariantsIdPageProps {
  params: {
    productId: string;
    variantId: string;
  };
}
const VariantsId = async ({ params }: VariantsIdPageProps) => {
  const product = await getProductById(params.productId);
  const variant = await getVariantById(params.variantId);

  return (
    <div>
      <EditVariantForm variant={variant} product={product} />
    </div>
  );
};

export default VariantsId;
