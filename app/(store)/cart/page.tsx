import getCurrentUser from "@/actions/getCurrentUser";
import getProducts from "@/actions/getProducts";
import CartClient from "@/components/product/CartClient";

const Cart = async () => {
  const currentUser = await getCurrentUser();
  const products = await getProducts();
  return (
    <div>
      <CartClient currentUser={currentUser} products={products} />
    </div>
  );
};

export default Cart;
