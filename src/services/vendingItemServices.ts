import axiosInstance from "../lib/axios";
import { Item } from "./itemServices";
import { VendingMachine } from "./vendingMachineServices";


//Model for crud
export interface VendingItem {
    id?: number;
    vendingMachineId: number;
    vendingMachine?: VendingMachine;
    itemId: number;
    item?: Item;
    quantity: number;
    capacity: number;
    lastUpdated?: string
}

//for showing grid
export interface VendingItemDetail {
    id: number;
    vendingMachineId: number;
    quantity: number;
    capacity: number;
    price: number;
    itemName: string;
    categoryName: string;
}

//for table show
export interface VendingMachineWithStock {
    id: number;
    name: string;
    machineCode: string;
    totalItemTypes: number;
    totalStock: number;
    totalCategories: number;
}

export const vendingItemService = {
    getMachineWithStock: async (page: number = 1, pageSize: number = 10, search: string = "") => {
        const response = await axiosInstance.get("/api/vendingitem/vendingwithstock", {
            params: { page, pageSize, search: search || undefined },
        });
        return response.data;
    },

    getItemsByMachine: async (page: number = 1, pageSize: number = 10, search: string = "", id: number) => {
        const response = await axiosInstance.get(`/api/vendingitem/getitembymachine/${id}`, {
            params: { page, pageSize, search: search || undefined },
        });

        return response.data;
    },

    assignItemToMachine: async (data: VendingItem) => {
        const response = await axiosInstance.post("/api/vendingitem/assignitemtomachine", data);
        return response.data;
    },

    removeItemFromMachine: async (id: number) => {
        const response = await axiosInstance.delete(`/api/vendingitem/${id}`);
        return response.data;
    },

    restock: async (id: number, qty: number) => {
        const response = await axiosInstance.put(`/api/vendingitem/${id}/restock`, { quantity: qty });
        return response.data;
    }

}