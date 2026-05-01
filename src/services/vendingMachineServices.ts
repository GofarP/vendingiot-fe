import axiosInstance from "../lib/axios";
export interface VendingMachine {
    id?: number;
    machineCode?: string;
    name?: string;
    location?: string;
    isActive?: boolean;
    lastRestock?: string;
}

export const vendingMachineService = {
    getAll: async (page: number = 1, pageSize: number = 10, search: string = "") => {
        const response = await axiosInstance.get("/api/vendingmachine", {
            params: {
                page,
                pageSize,
                search: search || undefined
            },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axiosInstance.get<VendingMachine>(`/api/vendingmachine/${id}`);
        return response.data;
    },

    create: async (data: VendingMachine) => {
        const response = await axiosInstance.post("/api/vendingmachine", data);
        return response.data;
    },

    update: async (id: number, data: VendingMachine) => {
        const response = await axiosInstance.put(`/api/vendingmachine/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/api/veinndingmachine/${id}`);
        return response.data;
    }
}