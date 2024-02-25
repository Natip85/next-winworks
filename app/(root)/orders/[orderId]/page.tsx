import { getOrderById } from "@/actions/getOrderById";
import getProducts from "@/actions/getProducts";
import AddOrderForm from "@/components/order/AddOrderForm";
interface OrderPageProps {
  params: {
    orderId: string;
  };
}
const Order = async ({ params }: OrderPageProps) => {
  const order = await getOrderById(params.orderId);
  const products = await getProducts();
  return (
    <div>
      <AddOrderForm order={order} products={products} />
    </div>
  );
};

export default Order;
