"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { API_URL } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

const SellerInfoSkeleton = () => (
  <Card className="mt-6">
    <CardHeader>
      <Skeleton className="h-6 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <Skeleton className="mt-4 h-10 w-full" />
    </CardContent>
  </Card>
);


const SellerInfo = ({ accountId }) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    async function fetchShopInfo() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/user/shop/${accountId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch shop info");
        }
        const result = await res.json();
        if (result.success && result.data.shop) {
          setShop(result.data.shop);
        } else {
          throw new Error(result.message || "Shop data not found");
        }
      } catch (error) {
        console.error("Error fetching shop info:", error);
        setShop(null);
      } finally {
        setLoading(false);
      }
    }

    fetchShopInfo();
  }, [accountId]);

  if (loading) {
    return <SellerInfoSkeleton />;
  }

  if (!shop) {
    return null; // Don't render anything if there's no shop info
  }

  const sellerInitials = shop.fullName.substring(0, 2).toUpperCase();

  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-semibold">Seller Information</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={shop.avatar} alt={shop.fullName} />
            <AvatarFallback>{sellerInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base">{shop.fullName}</span>
              <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                Verified Seller
              </span>
            </div>
            <p className="text-sm text-gray-500">ID: {shop._id}</p>
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 text-gray-300 fill-current" />
              </div>
              <span className="ml-2 text-sm text-gray-600">4.5</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link href={`/shops/${shop._id}`} passHref>
            <Button className="w-full">
              Visit Shop
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerInfo;