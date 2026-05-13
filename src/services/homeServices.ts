import axiosInstance from "../lib/axios";
export interface HomeStats{
    totalUsers:number;
    totalMachines:number;
    totalDepartments:number;
}

export const homeService={
    getStats:async():Promise<HomeStats>=>{
        const res=await axiosInstance.get<HomeStats>('/api/home/stats');
        return res.data;
    }
}