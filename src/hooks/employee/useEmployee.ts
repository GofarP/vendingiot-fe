"use client"
import { useState, useEffect, useCallback } from "react"
import { employeeService, Employee } from "@/src/services/employeeServices"
import { ActionResponse } from "@/src/types/common"
import { departmentService } from "@/src/services/departmentServices";
import { refresh } from "next/cache";

export function useEmployee() {
    const [employee, setEmployee] = useState<Employee[]>([]);
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
    })

    const fetchEmployee = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await departmentService.getAll(page, pageSize, search);
            setEmployee(response.data);
            setMeta(response.pagination);

        } catch (err: any) {
            setError(err.message || "Gagal mengambil data departemen");
        }
        finally {
            setLoading(false);
        }
    }, [page, pageSize, search]);

    useEffect(() => {
        fetchEmployee();
    }, [fetchEmployee]);

    const addEmployee = async (payload: Employee, photoFile: File): Promise<ActionResponse> => {
        try {
            await employeeService.create(payload, photoFile);
            await fetchEmployee();
            return { success: true, message: "Berhasil menambah data employee" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menyimpan",
                errors: err.response?.data?.errors
            };
        }
    }

    const updateEmployee = async (id: number, payload: Employee, photoFile: File): Promise<ActionResponse> => {
        try {
            await employeeService.update(id, payload, photoFile);
            await fetchEmployee();
            return { success: true, message: "Berhasil memperbarui data" };
        }
        catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal memperbarui",
                errors: err.response?.data?.errors
            }
        }
    }

    const deleteEmployee = async (id: number): Promise<ActionResponse> => {
        try {
            await employeeService.delete(id);
            await fetchEmployee();
            return { success: true, message: "Berhasil menghapus data" };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Gagal menghapus"
            }
        }
    };

    return{
        employee,
        loading,
        error,
        meta,
        page,
        setPage,
        pageSize,
        setPageSize,
        search,
        setSearch,
        refresh:fetchEmployee,
        addEmployee,
        updateEmployee,
        deleteEmployee
    }
}