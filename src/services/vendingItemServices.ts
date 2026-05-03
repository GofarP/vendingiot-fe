import axiosInstance from "../lib/axios";
import { Item } from "./itemServices";
import { VendingMachine } from "./vendingMachineServices";
export interface VendingItem {
    id?: number;
    vendingMachineId: number;
    vendingMachine?: VendingMachine;
    itemId: number;
    item?: Item;
    quantity: number;
    capacity: number;
    lastUpdated?: string;
}
export const vendingItemService = {
    getMachineWithStock: async (page: number = 1, pageSize: number = 10, search: string = "") => {
        const response = await axiosInstance.get("/api/vendingitem/vendingwithstock", {
            params: {
                page,
                pageSize,
                search: search || undefined
            },
        });
        return response.data;
    },

    getItemsByMachine: async (page: number = 1, pageSize: number = 10, search: string = "", id: number) => {
        const response = await axiosInstance.get(`/api/vendingitem/machine/${id}`, {
            params: {
                page,
                pageSize,
                search: search || undefined
            },
        });
        return response.data;
    },


    assignItemToMachine: async (data: VendingItem) => {
        const response = await axiosInstance.post("/api/vendingitem/assignitemtomachine", data);
        return response.data;

    },

    removeItemFromMachine: async (id: number) => {
        const response = await axiosInstance.delete(`/api/vendingitem/${id}`);
        return response.data
    },

    restock: async (id: number, qty: number) => {
        const response = await axiosInstance.put(`/api/vendingmachine/${id}/restock`);
        return response.data;
    }
}

