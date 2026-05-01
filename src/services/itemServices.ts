import axiosInstance from "../lib/axios";

export interface Item {
    id?: number;
    name?: string;
    itemCategoryId?: number;
    itemCategoryName?:string;
    price?: number;
    quantity?: number;
}

export const itemService = {
    getAll: async (page: number = 1, pageSize: number = 10, search: string = "") => {
        const response = await axiosInstance.get("/api/item", {
            params: {
                page,
                pageSize,
                search: search || undefined
            },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axiosInstance.get<Item>(`/api/item/${id}`);
        return response.data;
    },

    create: async (data: Item) => {
        const response = await axiosInstance.post("/api/item", data);
        return response.data;
    },

    update: async (id: number, data: Item) => {
        const response = await axiosInstance.put(`/api/item/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/api/item/${id}`);
        return response.data;
    }

}