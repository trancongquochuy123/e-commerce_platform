export const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(number);
};

export const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const buildPageNumbers = (currentPage, totalPages, radius = 1) => {
    if (!totalPages) return [];
    const start = Math.max(1, currentPage - radius);
    const end = Math.min(totalPages, currentPage + radius);
    const pages = [];
    for (let i = start; i <= end; i += 1) {
        pages.push(i);
    }
    return pages;
};
