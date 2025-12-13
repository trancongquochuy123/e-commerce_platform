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
        width={500}
        height={500}
        className="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75"
        priority
      />
      <div className="h-12">
        <span className="text-lg text-gray-700">{product.name}</span>
      </div>
      {/* <div className="h-4"></div> */}
      <p className="mt-1 text-xl font-medium text-[#ff5000]">{product.price}</p>
    </Link>
  );
}
