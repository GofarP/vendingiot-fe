"use client"
import { useState, useEffect, useCallback } from "react"
import { ItemCategory, itemCategoryService } from "@/src/services/itemCategoryServices"
import { ActionResponse } from "@/src/types/common"

export function useItemCategory() {
    const [itemCategory, setItemCategory] = useState<ItemCategory[]>([]);
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

    const fetchItemCategory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await itemCategoryService.getAll(page, pageSize, search);
            setItemCategory(response.data);
            setMeta(response.pagination);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data item category");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchItemCategory();
    }, [fetchItemCategory]);

    const addItemCategory = async (payload: ItemCategory): Promise<ActionResponse> => {
        try {
            await itemCategoryService.create(payload);
            await fetchItemCategory();
            return { success: true, message: "Berhasil menambah item category" }
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menyimpan",
                errors: err.response?.data?.errors
            }
        }
    }

    const updateItemCategory = async (id: number, payload: ItemCategory): Promise<ActionResponse> => {
        try {
            await itemCategoryService.update(id, payload);
            await fetchItemCategory();
            return { success: true, message: "Berhasil memperbarui data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal memperbarui",
                errors: err.response?.data?.errors
            };
        }
    }


    const deleteItemCategory = async (id: number): Promise<ActionResponse> => {
        try {
            await itemCategoryService.delete(id);
            await fetchItemCategory();
            return { success: true, message: "Berhasil menghapus data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menghapus"
            };
        }
    };

    return {
        itemCategory,
        loading,
        error,
        meta,
        page,
        setPage,
        setPageSize,
        search,
        setSearch,
        refresh: itemCategory,
        addItemCategory,
        updateItemCategory,
        deleteItemCategory,
    }

}