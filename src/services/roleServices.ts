"use client"
import axiosInstance from "../lib/axios";

export interface Permission {
  Id: number;
  Name: string;
  Category: string;
}

export interface Role {
  Id?: string;
  Name: string;
  PermissionIds: number[];
}

export interface PermissionGroup {
  Category: string;
  Permissions: Permission[];
}


export const roleService = {
    getAll: async (page: number = 1, pageSize: number = 10, search: string = "") => {
        const response = await axiosInstance.get("/api/role", {
            params: {
                page,
                pageSize,
                search: search || undefined
            },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await axiosInstance.get<Role>(`/api/role/${id}`);
        return response.data;
    },

    create:async(data:Role)=>{
        const response=await axiosInstance.post<Role>(`/api/role`,data);
        return response.data;
    },

    update:async(id:number, data:Role)=>{
        const response=await axiosInstance.put(`/api/role/${id}`,data);
        return response.data;
    },

    delete:async(id:number)=>{
        const response=await axiosInstance.delete(`/api/role/${id}`);
        return response.data;
    }


}