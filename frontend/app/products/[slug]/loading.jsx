import Header from "@/components/header";

export default function Loading() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="mb-8 flex items-center space-x-2">
            <div className="h-4 w-16 rounded bg-gray-200"></div>
            <div className="h-4 w-4 rounded bg-gray-200"></div>
            <div className="h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-4 w-4 rounded bg-gray-200"></div>
            <div className="h-4 w-32 rounded bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
            {/* Image Skeleton */}
            <div className="lg:col-span-1">
              <div className="aspect-square w-full rounded-lg bg-gray-200"></div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gray-200"
                  ></div>
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="lg:col-span-1">
              <div className="mb-4 h-10 w-3/4 rounded bg-gray-200"></div>
              <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
              <div className="mb-6 h-12 w-1/3 rounded bg-gray-200"></div>
              <div className="mb-8 h-6 w-1/3 rounded bg-gray-200"></div>

              <div className="mb-8 space-y-3">
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              </div>

              <div className="mb-8 flex gap-4">
                <div className="h-12 flex-1 rounded bg-gray-200"></div>
                <div className="h-12 w-12 rounded bg-gray-200"></div>
              </div>

              <div className="border-t pt-8">
                <div className="space-y-2">
                  <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
