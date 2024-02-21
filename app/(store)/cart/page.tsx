import getCurrentUser from "@/actions/getCurrentUser";
import Container from "@/components/Container";
import CartClient from "@/components/product/CartClient";

const Cart = async () => {
  const currentUser = await getCurrentUser();
  return (
    <Container>
      <CartClient currentUser={currentUser} />
    </Container>
  );
};

export default Cart;
