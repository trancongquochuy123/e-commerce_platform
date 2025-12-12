import ProductSkeleton from "./product-skeleton";

export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 py-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
