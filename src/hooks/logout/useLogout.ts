import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../services/authServices";
import { useAuth } from "../../context/AuthContext";

export const useLogout=()=>{
    const [isLoggingOut, setIsLoggingOut]=useState<boolean>(false);
    const {setUser}=useAuth();
    const router=useRouter();

    const logout=async():Promise<void>=>{
        setIsLoggingOut(true);
        try{
            await authService.logout();
        }
        catch(error){
           console.warn("Logout failed, cleaning local state")
        }
        finally{
            setUser(null);
            router.push("/login");
            setIsLoggingOut(true);
            localStorage.clear();
        }
    };

    return {logout, isLoggingOut};
}