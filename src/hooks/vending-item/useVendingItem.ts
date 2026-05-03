"use client"
import { useState, useEffect, useCallback } from "react"
import { VendingItem, vendingItemService } from "@/src/services/vendingItemServices";
import { ActionResponse } from "@/src/types/common";

export function useVendingItem() {
    const [vendingItem, setVendingItem] = useState<VendingItem[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [id, setId] = useState(0);
    const [meta, setMeta] = useState({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 5,
    });

    const fetchVendingMachineWithStock = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await vendingItemService.getMachineWithStock(page, pageSize, search);
            setVendingItem(response.data);
            setMeta(response.pagination);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil vending item");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    const fetchItemByMachine = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await vendingItemService.getItemsByMachine(page, pageSize, search, id);
            setVendingItem(response.data);
            setMeta(response.pagination);
            console.log(response.data);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data vending Item");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search,id]);

    useEffect(() => {
        if (id > 0) {
            fetchItemByMachine();
        } else {
            fetchVendingMachineWithStock();
        }
    }, [id, fetchVendingMachineWithStock, fetchItemByMachine])



    const assignItemToMachine = async (payload: VendingItem): Promise<ActionResponse> => {
        try {
            await vendingItemService.assignItemToMachine(payload);
            await fetchVendingMachineWithStock();
            return { success: true, message: "Berhasil menambah stock ke dalam mesin" }

        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menyimpan",
                errors: err.response?.data?.errors
            }
        }
    }

    const removeItemFromMachine = async (id: number): Promise<ActionResponse> => {
        try {
            await vendingItemService.removeItemFromMachine(id);
            await fetchVendingMachineWithStock();
            return { success: true, message: "Berhasil menghapus data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menghapus"
            };
        }
    };

    const restock = async (id: number, qty: number): Promise<ActionResponse> => {
        try {
            await vendingItemService.restock(id, qty);
            await fetchItemByMachine();
            return { success: true, message: "Berhasil restock data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal restock"
            }
        }
    }

    return {
        vendingItem,
        loading,
        error,
        meta,
        page,
        setPage,
        setId,
        pageSize,
        setPageSize,
        search,
        setSearch,
        refresh: vendingItem,
        fetchVendingMachineWithStock,
        fetchItemByMachine,
        removeItemFromMachine,
        assignItemToMachine,
        restock,
    };

}