import axiosInstance from "../lib/axios";

export interface ItemCategory {
    id?: number;
    name?: string;
    description: string;
}

export const itemCategoryService = {
    getAll: async (page: number = 1, pageSize: number = 10, search: string = "") => {
        const response = await axiosInstance.get("/api/itemcategory", {
            params: {
                page,
                pageSize,
                search: search || undefined
            },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axiosInstance.get<ItemCategory>(`/api/itemcategory/${id}`);
        return response.data;
    },

    create: async (data: ItemCategory) => {
        const response = await axiosInstance.post("/api/itemcategory", data);
        return response.data;
    },

    update: async (id: number, data: ItemCategory) => {
        const response = await axiosInstance.put(`/api/itemcategory/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/api/itemcategory/${id}`);
        return response.data;
    },

}