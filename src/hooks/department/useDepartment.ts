"use client";
import { useState, useEffect, useCallback } from "react";
import { departmentService, Department } from "../../services/departmentServices";
import { ActionResponse } from "@/src/types/common";



export function useDepartment() {
  const [department, setDepartment] = useState<Department[]>([]);
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

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await departmentService.getAll(page, pageSize, search);

      setDepartment(response.data);
      setMeta(response.pagination);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data departemen");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const addDepartment = async (payload: Department): Promise<ActionResponse> => {
    try {
      await departmentService.create(payload);
      await fetchDepartments();
      return { success: true, message: "Berhasil menambah data" };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal menyimpan",
        errors: err.response?.data?.errors
      };
    }
  }
  const updateDepartment = async (id: number, payload: Department): Promise<ActionResponse> => {
    try {
      await departmentService.update(id, payload);
      await fetchDepartments();
      return { success: true, message: "Berhasil memperbarui data" };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal memperbarui",
        errors: err.response?.data?.errors
      };
    }
  };

  const deleteDepartment = async (id: number): Promise<ActionResponse> => {
    try {
      await departmentService.delete(id);
      await fetchDepartments();
      return { success: true, message: "Berhasil menghapus data" };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal menghapus"
      };
    }
  };

  return {
    department,
    loading,
    error,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    refresh: fetchDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
}