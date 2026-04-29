"use client"
import { useState, useEffect, useCallback } from "react"
import { PermissionCategory, permissionCategoryService } from "@/src/services/permissionCategoryServices"
import { departmentService } from "@/src/services/departmentServices";
import { ActionResponse } from "@/src/types/common";

export function usePermissionCategory() {
    const [permissionCategory, setPermissionCategory] = useState<PermissionCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [search, setSearch] = useState("");
    const [meta, setMeta] = useState({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 5,
    });

    const fetchPermissionCategory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await permissionCategoryService.getAll(page, pageSize, search);
            setPermissionCategory(response.data);
            setMeta(response.pagination);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data departemen");
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchPermissionCategory();
    }, [fetchPermissionCategory]);

    const addPermissionCategory = async (payload: PermissionCategory): Promise<ActionResponse> => {
        try {
            await permissionCategoryService.create(payload);
            await fetchPermissionCategory();
            return { success: true, message: "Berhasil menambah permission category" }
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menyimpan",
                errors: err.response?.data?.errors
            }
        }
    }

    const updateDepartment = async (id: number, payload: PermissionCategory): Promise<ActionResponse> => {
        try {
            await permissionCategoryService.update(id, payload);
            await fetchPermissionCategory();
            return {success:true, message:"Berhasil memperbarui data"};
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal memperbarui",
                errors: err.response?.data?.errors
            };
        }
    }

    const deletePermissionCategory = async (id: number): Promise<ActionResponse> => {
        try {
            await permissionCategoryService.delete(id);
            await fetchPermissionCategory();
            return { success: true, message: "Berhasil menghapus data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menghapus"
            };
        }
    };

}
