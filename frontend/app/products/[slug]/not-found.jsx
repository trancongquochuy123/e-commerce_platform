import Header from "@/components/header";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Sorry, we couldn&apos;t find the product you&apos;re looking for. It
            may have been removed or is temporarily unavailable.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-[#ff5000] px-8 py-3 text-base font-medium transition hover:bg-[#e64700]"
            >
              Back to Home
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border-2 border-gray-300 px-8 py-3 text-base font-medium text-gray-700 transition hover:border-gray-400"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
