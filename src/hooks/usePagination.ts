"use client";
import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(data: T[], initialItemsPerPage: number) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

    const { currentData, totalPages } = useMemo(() => {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentData = data.slice(startIndex, startIndex + itemsPerPage);

        return { currentData, totalPages };
    }, [data, currentPage, itemsPerPage]);

    return {
        currentPage,
        setCurrentPage,
        currentData,
        totalPages,
        totalItems: data.length,
        itemsPerPage,
        setItemsPerPage
    };
}