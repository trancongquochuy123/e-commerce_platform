import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ShoppingCart() {
  const items = [
    {
      id: 1,
      title: "Nomad Tumbler",
      color: "White",
      status: "In stock",
      price: 35,
      img: "https://placehold.co/600x400",
    },
    {
      id: 2,
      title: "Basic Tee",
      color: "Sienna",
      size: "Large",
      status: "In stock",
      price: 32,
      img: "https://placehold.co/600x400",
    },
    {
      id: 3,
      title: "Basic Tee",
      color: "Black",
      size: "Large",
      status: "Ships in 3–4 weeks",
      price: 32,
      img: "https://placehold.co/600x400",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Shopping Cart</h1>

      {/* Items */}
      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-6">
            <div className="flex space-x-4">
              <img
                src={item.img}
                alt={item.title}
                className="h-28 w-24 rounded-lg object-cover"
              />

              <div className="space-y-1">
                <h2 className="font-medium">{item.title}</h2>
                {item.color && (
                  <p className="text-sm text-gray-500">{item.color}</p>
                )}
                {item.size && (
                  <p className="text-sm text-gray-500">{item.size}</p>
                )}
                <p
                  className={`text-sm ${item.status.includes("In stock") ? "text-green-600" : "text-gray-500"}`}
                >
                  {item.status}
                </p>
                <button className="text-sm text-[#ff5000] hover:underline">
                  Remove
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <Input
                type="number"
                min="1"
                defaultValue="1"
                className="w-16 rounded border px-2 py-1 text-sm"
              />
              <p className="font-medium">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-4 rounded-xl bg-gray-50 p-6">
        <div className="flex justify-between pt-2 text-lg font-semibold">
          <span>Order total</span>
          <span>$112.32</span>
        </div>
      </div>

      <button className="w-full rounded-lg bg-[#ff5000] py-3 font-medium text-white hover:cursor-pointer">
        Checkout
      </button>

      <p className="text-center text-sm text-gray-600">
        or{" "}
        <Link className="text-[#ff5000] hover:underline" href="/">
          Continue Shopping →
        </Link>
      </p>
    </div>
  );
}
