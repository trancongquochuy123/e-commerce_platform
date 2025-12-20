import Header from "@/components/header";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/add-to-cart-button";
import { API_URL } from "@/lib/constants";
import { SlashIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductGallery from "@/components/product-gallery";

async function getProduct(slug) {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const response = await res.json();

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const displayPrice = product.priceNew || product.price;
  const originalPrice = product.price;
  const hasDiscount = product.discountPercentage > 0;

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {/* <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="text-gray-900">Products</span>
            </li>
            <li className="text-gray-400">/</li>
            <li className="max-w-xs truncate font-medium text-gray-900">
              {product.title}
            </li>
          </ol>
        </nav> */}

        <Breadcrumb className="mb-8">
          <BreadcrumbList className="">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-gray-500 hover:text-gray-700"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/components"
                className="text-gray-500 hover:text-gray-700"
              >
                Components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-gray-900">
              Incredible Rubber Gloves
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
          {/* Product Image */}
          <ProductGallery product={product} />

          {/* Product Info */}
          <div className="lg:col-span-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.title}
            </h1>

            {/* Category & Brand */}
            <div className="mt-3 flex flex-wrap gap-3">
              {product.product_category_id && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {product.product_category_id.title}
                </span>
              )}
              {product.brand && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Rating */}
            {product.averageRating && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(product.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.totalReviews}{" "}
                  reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-6">
              <div className="flex items-baseline gap-4">
                <p className="text-3xl font-bold text-[#ff5000]">
                  ${displayPrice?.toLocaleString()}
                </p>
                {hasDiscount && (
                  <>
                    <p className="text-xl text-gray-500 line-through">
                      ${originalPrice?.toLocaleString()}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                      -{product.discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Availability Status */}
            <div className="mt-6">
              <div className="flex items-center gap-4">
                <div>
                  {product.stock > 0 ? (
                    <p className="text-sm font-medium text-green-600">
                      ✓ {product.availabilityStatus || "In Stock"} (
                      {product.stock} available)
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-red-600">
                      ✗ Out of Stock
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <div
                className="prose prose-sm mt-4 max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-lg font-medium text-gray-900">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Component */}
            <AddToCartButton productId={product._id} stock={product.stock} />

            {/* Product Specifications */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                Specifications
              </h2>
              <div className="space-y-3 text-sm">
                {product.sku && (
                  <p>
                    <span className="font-medium text-gray-700">SKU:</span>{" "}
                    <span className="text-gray-600">{product.sku}</span>
                  </p>
                )}
                {product.weight && (
                  <p>
                    <span className="font-medium text-gray-700">Weight:</span>{" "}
                    <span className="text-gray-600">{product.weight} kg</span>
                  </p>
                )}
                {product.dimensions && (
                  <p>
                    <span className="font-medium text-gray-700">
                      Dimensions:
                    </span>{" "}
                    <span className="text-gray-600">
                      {product.dimensions.width} x {product.dimensions.height} x{" "}
                      {product.dimensions.depth} cm
                    </span>
                  </p>
                )}
                {product.createdAt && (
                  <p>
                    <span className="font-medium text-gray-700">
                      Listed on:
                    </span>{" "}
                    <span className="text-gray-600">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.reviewerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating
                              ? "text-lg text-yellow-400"
                              : "text-lg text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              Related Products
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {product.relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  href={`/products/${related.slug}`}
                  className="group rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={related.thumbnail}
                      alt={related.title}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#ff5000]">
                    {related.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-bold text-[#ff5000]">
                        ${parseFloat(related.priceNew).toLocaleString()}
                      </p>
                      {related.discountPercentage > 0 && (
                        <span className="text-xs font-medium text-red-600">
                          -{related.discountPercentage}%
                        </span>
                      )}
                    </div>
                    {related.rating && (
                      <span className="text-yellow-400">
                        ★ {related.rating}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
