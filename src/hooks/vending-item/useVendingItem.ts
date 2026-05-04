"use client"
import { useState, useEffect, useCallback } from "react";
import {
    VendingItem,
    VendingItemDetail,
    VendingMachineWithStock,
    vendingItemService
}
    from "@/src/services/vendingItemServices";

import { ActionResponse } from "@/src/types/common";

export function useVendingItem() {
    const [vendingMachines, setVendingMachines] = useState<VendingMachineWithStock[]>([]);
    const [machineItems, setMachineItems] = useState<VendingItemDetail[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [id, setId] = useState(0);
    const [machineCode, setMachineCode]=useState("");

    const [meta, setMeta] = useState({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10
    });

    const fetchVendingMachineWithStock = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response=await vendingItemService.getMachineWithStock(page, pageSize, search);
            setVendingMachines(response.data);
            setMeta(response.pagination);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data mesin");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    const fetchItemByMachine = useCallback(async () => {
        if (id === 0) return;
        setLoading(true);
        setError(null);
        try {
            const response = await vendingItemService.getItemsByMachine(page, pageSize, search, id);
            setMachineItems(response.data);
            setMeta(response.pagination);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil detail barang");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search, id]);

    useEffect(() => {
        if (id > 0) {
            fetchItemByMachine();
        } else {
            fetchVendingMachineWithStock();
        }
    }, [id, fetchVendingMachineWithStock, fetchItemByMachine]);

    const assignItemToMachine = async (payload: VendingItem): Promise<ActionResponse> => {
        try {
            await vendingItemService.assignItemToMachine(payload);
            id > 0 ? await fetchItemByMachine() : await fetchVendingMachineWithStock();
            return { success: true, message: "Berhasil menambah stock ke dalam mesin" }
        }

        catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menyimpan",
                errors: err.response?.data?.errors
            }
        }
    };

    const removeItemFromMachine = async (itemId: number): Promise<ActionResponse> => {
        try {
            await vendingItemService.removeItemFromMachine(itemId);
            id > 0 ? await fetchItemByMachine() : await fetchVendingMachineWithStock();
            return { success: true, message: "Berhasil menghapus data" }
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menghapus"
            };
        }
    };

    const restock = async (itemId: number, qty: number): Promise<ActionResponse> => {
        try {
            await vendingItemService.restock(itemId, qty);
            await fetchItemByMachine();
            return { success: true, message: "Berhasil restock data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal restock"
            };
        }
    }

    return{
        vendingMachines,
        machineItems,
        loading,
        error,
        meta,
        page,
        id,
        machineCode,
        setPage,
        setId,
        setMachineCode,
        pageSize,
        setPageSize,
        search,
        setSearch,
        removeItemFromMachine,
        assignItemToMachine,
        restock
    }

}