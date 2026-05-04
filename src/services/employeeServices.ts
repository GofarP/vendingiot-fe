import axiosInstance from "../lib/axios";
export interface Employee {
    id?:number;
    fullName?: string;
    userName?: string;
    email?: string;
    password?:string;
    photoUrl?: string;
    photo?: File | null;
}

export const employeeService = {
    getAll: async (page: number, pageSize: number = 10, search: string = "") => {
        const response = await axiosInstance.get("/api/user", {
            params: {
                page,
                pageSize,
                search: search || undefined
            },
        });
        

        return response.data;
    },

    getById: async (id: number) => {
        const response = await axiosInstance.get<Employee>(`/api/user/${id}`);
        return response.data;
    },

    create: async (data: Employee, photoFile?: File) => {
        const formData = new FormData();
        if (data.fullName) formData.append("fullName", data.fullName);
        if (data.userName) formData.append("userName", data.userName);
        if (data.email) formData.append("email", data.email);

        if (photoFile) {
            formData.append('photo', photoFile);
        }

        const response = await axiosInstance.post(`/api/user`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        return response.data;
    },

    update: async (id: number, data: Employee, photoFile?: File) => {
        const formData = new FormData();

        if (data.fullName) formData.append("fullName", data.fullName);
        if (data.userName) formData.append("userName", data.userName);
        if (data.email) formData.append("email", data.email);

        if (photoFile) {
            formData.append("photo", photoFile);
        }

        const response = await axiosInstance.put(`/api/user/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/api/user/${id}`);
        return response.data;
    }


}