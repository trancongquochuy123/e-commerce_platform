import ProductCard from "./product-card";

export default function ProductGrid({ products }) {
  let productList = [];
  products.forEach((product) => {
    productList.push(<ProductCard key={product.id} product={product} />);
  });
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 py-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {productList}
    </div>
  );
}
  