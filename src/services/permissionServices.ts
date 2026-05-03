
import axiosInstance from "../lib/axios";
import { PermissionCategory } from "./permissionCategoryServices";

export interface Permission {
    id?: number;
    name?: string;
    permissionCategoryId:number;
    permissionCategory?:PermissionCategory
}

export const permissionService = {
    getAll: async (page: number = 1, pageSize: number = 10, search: string = "") => {
        const response = await axiosInstance.get("/api/permission", {
            params: {
                page,
                pageSize,
                search: search || undefined
            },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axiosInstance.get<Permission>(`/api/permission/${id}`);
        return response.data;
    },

    create: async (data: Permission) => {
        const response = await axiosInstance.post("/api/permission", data);
        return response.data;
    },

    update: async (id: number, data: Permission) => {
        const response = await axiosInstance.put(`/api/permission/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/api/permission/${id}`);
        return response.data;
    }
}