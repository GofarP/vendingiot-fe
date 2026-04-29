import axiosInstance from "../lib/axios";

export interface PermissionCategory {
    id: number;
    name: string;
    description: string;
}

export const permissionCategoryService = {
    getAll: async (page: number = 1, pageSize: number = 10, search: string = "") => {
        const response = await axiosInstance.get("/api/permissioncategory", {
            params: {
                page,
                pageSize,
                search: search || undefined
            },
        });

        return response.data;
    },

    getById: async (id: number) => {
        const response = await axiosInstance.get<PermissionCategory>(`/api/department/${id}`);
        return response.data;
    },

    create: async (data: PermissionCategory) => {
        const response = await axiosInstance.post("/api/permissioncategory", data);
        return response.data;
    },
    update: async (id: number, data: PermissionCategory) => {
        const response = await axiosInstance.put(`/api/permissioncategory/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/api/permissioncategory/${id}`);
        return response.data;
    },

}