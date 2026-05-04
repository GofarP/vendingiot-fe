"use client"
import { useState, useEffect, useCallback } from "react"
import { roleService, Role } from "@/src/services/roleServices"
import { ActionResponse } from "@/src/types/common";
import { refresh } from "next/cache";

export function useRole() {
    const [role, setRole] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [meta, setMeta] = useState({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
    });


    const fetchRole = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await roleService.getAll(page, pageSize, search);

            setRole(response.data);
            setMeta(response.pagination);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data role");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchRole();
    }, [fetchRole]);


    const addRole = async (payload: Role): Promise<ActionResponse> => {
        try {
            await roleService.create(payload);
            await fetchRole();
            return { success: true, message: "Berhasil menambah data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menyimpan",
                errors: err.response?.data?.errors
            };
        }
    }


    const updateRole = async (id: number, payload: Role): Promise<ActionResponse> => {
        try {
            await roleService.update(id, payload);
            await fetchRole();
            return { success: true, message: "Berhasil memperbarui data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal memperbarui",
                errors: err.response?.data?.errors
            };
        }
    };

    const deleteRole = async (id: number): Promise<ActionResponse> => {
        try {
            await roleService.delete(id);
            await fetchRole();
            return { success: true, message: "Berhasil menghapus data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menghapus"
            };
        }
    };

    return{
        role,
        loading,
        error,
        meta,
        page,
        setPage,
        pageSize,
        setPageSize,
        search,
        setSearch,
        refresh:fetchRole,
        addRole,
        updateRole,
        deleteRole
    }

}