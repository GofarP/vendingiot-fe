"use client"
import { useState, useEffect, useCallback } from "react"
import { Permission, permissionService } from "@/src/services/permissionServices";
import { ActionResponse } from "@/src/types/common";
export function usePermission() {
    const [permission, setPermission] = useState<Permission[]>([]);
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

    const fetchPermission = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await permissionService.getAll(page, pageSize, search);
            setPermission(response.data);
            setMeta(response.pagination);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data permission");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchPermission();
    }, [fetchPermission]);


    const addPermission = async (payload: Permission): Promise<ActionResponse> => {
        try {
            await permissionService.create(payload);
            await fetchPermission();
            return { success: true, message: "Berhasil menambah permission" }
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menyimpan",
                errors: err.response?.data?.errors
            }
        }
    }

    const updatePermission = async (id: number, payload: Permission): Promise<ActionResponse> => {
        try {
            await permissionService.update(id, payload);
            await fetchPermission();
            return { success: true, message: "Berhasil memperbarui data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal memperbarui",
                errors: err.response?.data?.errors
            };
        }
    }

    const deletePermission = async (id: number): Promise<ActionResponse> => {
        try {
            await permissionService.delete(id);
            await fetchPermission();
            return { success: true, message: "Berhasil menghapus data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menghapus"
            };
        }
    };

    return {
        permission: permission,
        loading,
        error,
        meta,
        page,
        setPage,
        setPageSize,
        search,
        setSearch,
        refresh: permission,
        addPermission: addPermission,
        updatePermission: updatePermission,
        deletePermission: deletePermission,
    }
}