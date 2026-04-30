"use client"
import { useState, useEffect, useCallback } from "react"
import { Item, itemService } from "@/src/services/itemServices"
import { ActionResponse } from "@/src/types/common";
export function useItem() {
    const [item, setItem] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [search, setSearch] = useState("");
    const [meta, setMeta] = useState({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 5,
    });

    const fetchItem = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await itemService.getAll(page, pageSize, search);
            setItem(response.data);
            setMeta(response.pagination);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data item category");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    const addItem = async (payload: Item): Promise<ActionResponse> => {
        try {
            await itemService.create(payload);
            await fetchItem();
            return { success: true, message: "Berhasil menambah item" }
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menyimpan",
                errors: err.response?.data?.errors
            }
        }
    }

    const updateItem = async (id: number, payload: Item): Promise<ActionResponse> => {
        try {
            await itemService.update(id, payload);
            await fetchItem();
            return { success: true, message: "Berhasil memperbarui data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal memperbarui",
                errors: err.response?.data?.errors
            };
        }
    }

    const deleteItem = async (id: number): Promise<ActionResponse> => {
        try {
            await itemService.delete(id);
            await fetchItem();
            return { success: true, message: "Berhasil menghapus data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menghapus"
            };
        }
    };

    return {
        item,
        loading,
        error,
        meta,
        page,
        setPage,
        setPageSize,
        search,
        setSearch,
        refresh: item,
        addItem,
        updateItem,
        deleteItem,
    }
}