import { create } from "domain";
import axiosInstance from "../lib/axios";
import { ActionResponse } from "../types/common";

export interface Role {
  id?: string;
  name: string;
  permissionIds: number[];
  permissions?: string[];
}

export interface PermissionGroup {
  category: string;
  permissions: {
    id: number;
    name: string;
  }[];
}

export const roleService = {
  getAll: async (page = 1, pageSize = 10, search = "") => {
    const res = await axiosInstance.get("/api/role", {
      params: { page, pageSize, search: search || undefined },
    });

    return res.data;
  },

  getPermissions: async (search: string = "") => {
    const res = await axiosInstance.get("/api/permission", {
      params: { search: search || undefined, pageSize: 50 }
    });

    return res.data;
  },

  create: async (data: Role): Promise<ActionResponse> => {
    try {
      await axiosInstance.post("/api/role", data);
      return { success: true, message: "Success Menambahkan Role " }
    } catch (err: any) {
      return { success: false, errors: err.response?.data?.errors, message: err.response?.data?.message };
    }
  },

  update: async (id: string, data: Role): Promise<ActionResponse> => {
    try {
      await axiosInstance.put(`/api/role/${id}`, data);
      return { success: true, message: "Ok" };
    } catch (err: any) {
      return { success: false, errors: err.response?.data?.errors, message: err.response?.data?.message };
    }
  },

  delete:async(id:string):Promise<ActionResponse>=>{
    try{
      await axiosInstance.delete(`/api/role/${id}`);
      return {success:true, message:"Success deleting role"}
    }
    catch(err:any){
      return {success:false, message:err.response?.data?.message}
    }
  }




}