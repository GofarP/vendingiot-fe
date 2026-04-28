import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../services/authServices";
import { LoginRequest, ApiValidationError } from "@/src/types/auth"; 
import { useAuth } from "@/src/context/AuthContext";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  const { setUser } = useAuth();
  const router = useRouter();

  const performLogin = async (formData: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await authService.login(formData);
      
      setUser(response);
      
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorData = err as ApiValidationError;

      if (errorData.errors) {
        setFieldErrors(errorData.errors);
      }

      setError(errorData.message || "An unexpected error occurred");
      
    } finally {
      setIsLoading(false);
    }
  };

  return { performLogin, isLoading, error, fieldErrors };
};