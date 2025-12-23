import Image from "next/image";
import "../public/styles/main.css";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={product.href}
      className="group transition-all duration-300 hover:-translate-y-2"
    >
      <Image
        alt={product.imageAlt}
        src={product.imageSrc}
        width={300}
        height={300}
        className="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75"
        priority
      />
      <div className="h-12">
        <span className="text-base text-gray-700">{product.name}</span>
      </div>
      {/* <div className="h-4"></div> */}
      {/* Category Display */}
      {product.category && (
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
      )}
      {/* Original Price (if discounted) */}
      {product.originalPrice && (
        <p className="text-sm text-gray-400 line-through">
          {product.originalPrice}
        </p>
      )}
      <p className="mt-1 text-xl font-medium text-[#ff5000]">{product.price}</p>
    </Link>
  );
}
