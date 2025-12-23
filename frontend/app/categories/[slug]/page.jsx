import React from "react";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import ProductGrid from "@/components/product-grid";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import Header from "@/components/header";

function formatPrice(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return "";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(num);
}

function mapProductsToCards(products) {
    return products.map((p) => ({
        id: p._id,
        href: `/products/${p.slug}`,
        imageSrc:
            p.thumbnail ||
            (Array.isArray(p.images) && p.images[0]) ||
            "/placeholder.png",
        imageAlt: p.title,
        name: p.title,
        price: formatPrice(p.priceNew ?? p.price),
    }));
}

export default async function CategoryPage({ params, searchParams }) {
    params = await params;
    searchParams = await searchParams;
    const slug = params.slug;
    const page = Number(searchParams?.page ?? 1) || 1;

    const res = await fetch(`${API_URL}/products/category/${slug}?page=${page}`);

    if (!res.ok) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-8">
                <h1 className="text-2xl font-semibold">Category</h1>
                <p className="mt-4 text-red-600">Failed to load category products.</p>
            </div>
        );
    }

    const payload = await res.json();
    const data = payload?.data || {};
    const meta = payload?.meta || {};
    const pagination = meta?.pagination || {
        currentPage: page,
        totalPages: 1,
        totalItems: data?.products?.length || 0,
    };

    const products = mapProductsToCards(data?.products || []);

    const totalPages = Number(pagination?.totalPages || 1);
    const currentPage = Number(pagination?.currentPage || page);

    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    const pageHref = (p) => `?page=${p}`;

    const breadcrumbCategoryTitle = data?.category?.title || slug;

    return (
        <>
            <Header />
            <div className="mx-auto max-w-7xl px-4 py-6">
                <Breadcrumb aria-label="breadcrumb" className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{breadcrumbCategoryTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <ProductGrid products={products} />

                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={hasPrev ? pageHref(currentPage - 1) : undefined}
                                        aria-disabled={!hasPrev}
                                    />
                                </PaginationItem>

                                {currentPage > 2 && (
                                    <>
                                        <PaginationItem>
                                            <PaginationLink href={pageHref(1)} size="default">
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

                                {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                                    .filter((p) => p >= 1 && p <= totalPages)
                                    .map((p) => (
                                        <PaginationItem key={p}>
                                            <PaginationLink
                                                href={pageHref(p)}
                                                isActive={p === currentPage}
                                                size="default"
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
                                            >
                                                {totalPages}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href={hasNext ? pageHref(currentPage + 1) : undefined}
                                        aria-disabled={!hasNext}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </>
    );
}
