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

            {/* Category */}
            {product.product_category_id && (
              <div className="mt-3">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {product.product_category_id.title}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-6">
              <div className="flex items-baseline gap-4">
                <p className="text-3xl font-bold text-[#ff5000]">
                  ${displayPrice}
                </p>
                {hasDiscount && (
                  <>
                    <p className="text-xl text-gray-500 line-through">
                      ${originalPrice}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                      -{product.discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mt-6">
              {product.stock > 0 ? (
                <p className="text-sm font-medium text-green-600">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-sm font-medium text-red-600">
                  ✗ Out of Stock
                </p>
              )}
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

            {/* Product Meta */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="space-y-2 text-sm text-gray-500">
                <p>
                  <span className="font-medium text-gray-700">Product ID:</span>{" "}
                  {product._id}
                </p>
                <p>
                  <span className="font-medium text-gray-700">SKU:</span>{" "}
                  {product.slug}
                </p>
                {product.createdAt && (
                  <p>
                    <span className="font-medium text-gray-700">
                      Listed on:
                    </span>{" "}
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                )}
                {product.position && (
                  <p>
                    <span className="font-medium text-gray-700">Position:</span>{" "}
                    {product.position}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
