"use client"
import { useState, useEffect, useCallback } from "react"
import { VendingMachine, vendingMachineService } from "@/src/services/vendingMachineServices"
import { ActionResponse } from "@/src/types/common";
export function useVendingMachine() {
    const [vendingMachine, setVendingMachine] = useState<VendingMachine[]>([]);
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


    const fetchVendingMachine = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await vendingMachineService.getAll(page, pageSize, search);
            setVendingMachine(response.data);
            setMeta(response.pagination);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data permission category");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchVendingMachine();
    }, [fetchVendingMachine]);

    const addVendingMachine = async (payload: VendingMachine): Promise<ActionResponse> => {
        try {
            await vendingMachineService.create(payload);
            await fetchVendingMachine();
            return { success: true, message: "Berhasil menambah vending Machine" }
        } catch (err: any) {
            console.log("create error:",err.response.data?.errors);
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menyimpan",
                errors: err.response?.data?.errors
            }
        }
    }

    const updateVendingMachine = async (id: number, payload: VendingMachine): Promise<ActionResponse> => {
        try {
            await vendingMachineService.update(id, payload);
            await fetchVendingMachine();
            return { success: true, message: "Berhasil memperbarui data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal memperbarui",
                errors: err.response?.data?.errors
            };
        }
    }

    const deleteVendingMachine = async (id: number): Promise<ActionResponse> => {
        try {
            await vendingMachineService.delete(id);
            await fetchVendingMachine();
            return { success: true, message: "Berhasil menghapus data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menghapus"
            };
        }
    };


    return {
        vendingMachine,
        loading,
        error,
        meta,
        page,
        setPage,
        pageSize,
        setPageSize,
        search,
        setSearch,
        refresh: fetchVendingMachine,
        addVendingMachine,
        updateVendingMachine,
        deleteVendingMachine,
    };

}