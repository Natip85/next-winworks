import getProducts from "@/actions/getProducts";
import Container from "@/components/Container";
import NullData from "@/components/NullData";
import ProductCard from "@/components/product/ProductCard";

const page = async () => {
  const products = await getProducts();
  if (products.length === 0) {
    return <NullData title="Oops! No products found" />;
  }
  return (
    <main className="p-8">
      <Container>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {products.map((product) => {
            return <ProductCard key={product.id} products={product} />;
          })}
        </div>
      </Container>
    </main>
  );
};

export default page;
