"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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
} from "./order-utils";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Package,
  Phone,
  Truck,
  XCircle,
} from "lucide-react";

const STATUS_STYLES = {
  pending: {
    label: "Pending",
    pill: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    icon: Clock3,
  },
  processing: {
    label: "Processing",
    pill: "border-sky-200 bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    pill: "border-indigo-200 bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    pill: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    pill: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    icon: XCircle,
  },
};

const EmptyState = () => (
  <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-gray-200 bg-white/70 p-10 text-center shadow-sm">
    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
      <Package className="size-8" />
    </div>
    <h3 className="mt-6 text-xl font-semibold text-gray-900">
      No orders in progress
    </h3>
    <p className="mt-2 text-sm text-gray-600">
      Orders that are still pending, processing, or shipped will appear here
      once created.
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
          <div className="h-3 w-32 rounded bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-28 rounded-xl bg-gray-100" />
          <div className="h-3 w-28 rounded bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
);

function StatusBadge({ status }) {
  const key = status?.toLowerCase();
  const config = STATUS_STYLES[key] || STATUS_STYLES.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${config.pill}`}
    >
      <span className={`size-2 rounded-full ${config.dot}`} aria-hidden />
      <Icon className="size-4" />
      {config.label}
    </span>
  );
}

function PaymentBadge({ isPaid }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
        isPaid
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {isPaid ? (
        <CheckCircle2 className="size-4" />
      ) : (
        <Clock3 className="size-4" />
      )}
      {isPaid ? "Paid" : "Awaiting Payment"}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page") || 1) || 1;

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const pageIntroPlayed = useRef(false);

  const currentPage = useMemo(
    () => Number(pagination?.currentPage || pageParam || 1),
    [pagination, pageParam],
  );
  const totalPages = Number(pagination?.totalPages || 1);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/checkout/order?page=${page}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const payload = await response.json();
      const rawOrders = payload?.data?.orders || [];
      const paginationMeta = payload?.data?.pagination || null;

      const filteredOrders = rawOrders.filter(
        (order) => order?.status?.toLowerCase() !== "delivered",
      );

      cardRefs.current = [];
      setOrders(filteredOrders);
      setPagination(paginationMeta);
    } catch (err) {
      console.error("Error loading orders", err);
      setError(
        "Unable to load your orders right now. Please try again shortly.",
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
    if (!containerRef.current || pageIntroPlayed.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    }, containerRef);

    pageIntroPlayed.current = true;

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!orders.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { opacity: 0, y: 30 },
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
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return undefined;

    const disposers = cards.map((card) => {
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

    return () => disposers.forEach((dispose) => dispose && dispose());
  }, [orders]);

  const handlePageChange = (page) => {
    if (!page || page === currentPage) return;
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", page);
    router.push(`/orders?${query.toString()}`);
  };

  const pageHref = (page) => `?page=${page}`;

  const visibleOrders = Array.isArray(orders) ? orders : [];

  const pageNumbers = useMemo(() => {
    return buildPageNumbers(currentPage, totalPages, 1);
  }, [currentPage, totalPages]);

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-orange-50 via-white to-white">
        <div
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
          ref={containerRef}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-orange-600 uppercase">
                Orders in progress
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                Your active orders
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Track orders that are pending, processing, or on the way to you.
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
                    className="h-full rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur"
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
                      </div>
                      <div className="flex flex-col items-end gap-2 text-right">
                        <StatusBadge status={order.status} />
                        <PaymentBadge isPaid={order.isPaid} />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-gray-50/80 p-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle2 className="size-4 text-orange-500" />
                        <span className="font-medium">
                          {order.userInfo?.fullName || "Guest"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Phone className="size-4 text-orange-500" />
                        <span>{order.userInfo?.phone || "No phone"}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-700 sm:col-span-2">
                        <MapPin className="mt-0.5 size-4 text-orange-500" />
                        <span>
                          {order.userInfo?.address || "No address provided"}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-700 sm:col-span-2">
                        <FileText className="mt-0.5 size-4 text-orange-500" />
                        <span>
                          {order.userInfo?.note || "No delivery note"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          Items
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
                            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3"
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
                              <p className="text-sm font-semibold text-gray-900">
                                {item.title || "Unknown product"}
                              </p>
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
                              <p className="font-semibold text-orange-600">
                                {formatCurrency(item.itemTotalPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between rounded-xl bg-orange-50/80 px-4 py-3 text-sm">
                      <span className="font-semibold text-gray-800">
                        Order total
                      </span>
                      <span className="text-lg font-bold text-orange-600">
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
