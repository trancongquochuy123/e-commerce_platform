"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { API_URL } from "@/lib/constants";
import { gsap } from "gsap";
import {
  buildPageNumbers,
  formatCurrency,
  formatDateTime,
} from "../order-utils";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
} from "lucide-react";

const DeliveredBadge = () => (
  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
    <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
    <CheckCircle2 className="size-4" />
    Delivered
  </span>
);

const PaymentMethodPill = ({ method }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs font-semibold text-gray-700">
    <CreditCard className="size-4" />
    {method ? method.toUpperCase() : "UNKNOWN"}
  </span>
);

const EmptyState = () => (
  <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-emerald-200 bg-white/80 p-10 text-center shadow-sm">
    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
      <PackageCheck className="size-8" />
    </div>
    <h3 className="mt-6 text-xl font-semibold text-gray-900">
      No delivered orders yet
    </h3>
    <p className="mt-2 text-sm text-gray-600">
      You have not completed any orders yet. Once an order is delivered and
      paid, it will appear here.
    </p>
  </div>
);

const LoadingSkeletons = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    {Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="h-full rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm"
      >
        <div className="flex animate-pulse flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="h-8 w-24 rounded-full bg-gray-200" />
          </div>
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-28 rounded-xl bg-gray-100" />
          <div className="h-3 w-28 rounded bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
);

export default function DeliveredOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page") || 1) || 1;

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const productRefs = useRef([]);
  const introPlayed = useRef(false);

  const currentPage = useMemo(
    () => Number(pagination?.currentPage || pageParam || 1),
    [pagination, pageParam],
  );
  const totalPages = Number(pagination?.totalPages || 1);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/checkout/boughts?page=${page}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch delivered orders");
      }

      const payload = await response.json();
      const rawOrders = payload?.data?.orders || [];
      const paginationMeta = payload?.data?.pagination || null;

      const filteredOrders = rawOrders.filter(
        (order) =>
          order?.status?.toLowerCase() === "delivered" &&
          order?.isPaid === true,
      );

      cardRefs.current = [];
      productRefs.current = [];
      setOrders(filteredOrders);
      setPagination(paginationMeta);
    } catch (err) {
      console.error("Error loading delivered orders", err);
      setError(
        "Unable to load delivered orders right now. Please try again shortly.",
      );
      setOrders([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pageParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParam]);

  useEffect(() => {
    if (!containerRef.current || introPlayed.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      );
    }, containerRef);

    introPlayed.current = true;

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!orders.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [orders]);

  useEffect(() => {
    const rows = productRefs.current.flat().filter(Boolean);
    if (!rows.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.04 },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [orders]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    const rows = productRefs.current.flat().filter(Boolean);
    if (!cards.length && !rows.length) return undefined;

    const cardListeners = cards.map((card) => {
      const onEnter = () => {
        gsap.to(card, {
          scale: 1.01,
          y: -4,
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.08)",
          duration: 0.25,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.05)",
          duration: 0.25,
          ease: "power2.out",
        });
      };
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      return () => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      };
    });

    const rowListeners = rows.map((row) => {
      const onEnter = () => {
        gsap.to(row, {
          scale: 1.005,
          y: -2,
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.06)",
          duration: 0.2,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(row, {
          scale: 1,
          y: 0,
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.04)",
          duration: 0.2,
          ease: "power2.out",
        });
      };
      row.addEventListener("mouseenter", onEnter);
      row.addEventListener("mouseleave", onLeave);
      return () => {
        row.removeEventListener("mouseenter", onEnter);
        row.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => {
      cardListeners.forEach((dispose) => dispose && dispose());
      rowListeners.forEach((dispose) => dispose && dispose());
    };
  }, [orders]);

  const handlePageChange = (page) => {
    if (!page || page === currentPage) return;
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", page);
    router.push(`/orders/bought?${query.toString()}`);
  };

  const pageHref = (page) => `?page=${page}`;

  const visibleOrders = Array.isArray(orders) ? orders : [];

  const pageNumbers = useMemo(() => {
    return buildPageNumbers(currentPage, totalPages, 1);
  }, [currentPage, totalPages]);

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
        <div
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
          ref={containerRef}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-emerald-600 uppercase">
                Delivered orders
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                Your completed purchases
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                View orders that have been delivered and paid successfully.
              </p>
            </div>
          </div>

          <div className="mt-8">
            {loading && <LoadingSkeletons />}

            {!loading && error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
                <AlertCircle className="mt-0.5 size-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Something went wrong</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && visibleOrders.length === 0 && <EmptyState />}

            {!loading && !error && visibleOrders.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {visibleOrders.map((order, idx) => (
                  <div
                    key={order._id}
                    ref={(el) => {
                      if (el) cardRefs.current[idx] = el;
                    }}
                    className="h-full rounded-2xl border border-gray-100 bg-white/85 p-6 shadow-sm backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Order ID
                        </p>
                        <p className="text-base font-semibold break-all text-gray-900">
                          {order._id}
                        </p>
                        <p className="text-sm text-gray-600">
                          Created {formatDateTime(order.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Paid on {formatDateTime(order.paidAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-right">
                        <DeliveredBadge />
                        <PaymentMethodPill method={order.method} />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-emerald-50/60 p-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 text-sm text-gray-800">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        <span className="font-medium">
                          {order.userInfo?.fullName || "Guest"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-800">
                        <Phone className="size-4 text-emerald-600" />
                        <span>{order.userInfo?.phone || "No phone"}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-800 sm:col-span-2">
                        <MapPin className="mt-0.5 size-4 text-emerald-600" />
                        <span>
                          {order.userInfo?.address || "No address provided"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          Purchased items
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.products?.length || 0} product
                          {(order.products?.length || 0) === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {(order.products || []).map((item, itemIdx) => (
                          <div
                            key={`${order._id}-${item.productId || itemIdx}`}
                            ref={(el) => {
                              if (!productRefs.current[idx])
                                productRefs.current[idx] = [];
                              if (el) productRefs.current[idx][itemIdx] = el;
                            }}
                            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/90 p-3"
                          >
                            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                              {item.thumbnail ? (
                                <Image
                                  src={item.thumbnail}
                                  alt={item.title || "Product thumbnail"}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              {item.slug ? (
                                <Link
                                  href={`/products/${item.slug}`}
                                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                                >
                                  {item.title || "Unknown product"}
                                </Link>
                              ) : (
                                <p className="text-sm font-semibold text-gray-900">
                                  {item.title || "Unknown product"}
                                </p>
                              )}
                              <p className="text-xs text-gray-600">
                                Quantity: {item.quantity || 0}
                              </p>
                            </div>
                            <div className="text-right text-sm text-gray-700">
                              <p className="text-xs text-gray-500">Final</p>
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(item.finalPrice)}
                              </p>
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="font-semibold text-emerald-700">
                                {formatCurrency(item.itemTotalPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between rounded-xl bg-emerald-50/80 px-4 py-3 text-sm">
                      <span className="font-semibold text-gray-800">
                        Order total
                      </span>
                      <span className="text-lg font-bold text-emerald-700">
                        {formatCurrency(order.totalOrderPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!loading && !error && totalPages > 1 && (
            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={
                        currentPage > 1 ? pageHref(currentPage - 1) : undefined
                      }
                      aria-disabled={currentPage <= 1}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {currentPage > 2 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href={pageHref(1)}
                          size="default"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {pageNumbers.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={pageHref(p)}
                        isActive={p === currentPage}
                        size="default"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href={pageHref(totalPages)}
                          size="default"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href={
                        currentPage < totalPages
                          ? pageHref(currentPage + 1)
                          : undefined
                      }
                      aria-disabled={currentPage >= totalPages}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
