export default function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square w-full rounded-lg bg-gray-200"></div>
      <div className="mt-3 h-12">
        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
      </div>
      <div className="mt-1">
        <div className="h-6 w-1/3 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
