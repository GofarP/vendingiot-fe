import axiosInstance from "../lib/axios";

export interface Department {
  id?: number;
  name: string;
  description: string;
}

export const departmentService = {
  getAll: async (page: number = 1, pageSize: number = 5, search: string = "") => {
    const response = await axiosInstance.get("/api/department", {
      params: { 
        page, 
        pageSize, 
        search: search || undefined
      },
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<Department>(`/api/department/${id}`);
    return response.data;
  },

  create: async (data: Department) => {
    const response = await axiosInstance.post("/api/department", data);
    return response.data;
  },

  update: async (id: number, data: Department) => {
    const response = await axiosInstance.put(`/api/department/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/api/department/${id}`);
    return response.data;
  },
};