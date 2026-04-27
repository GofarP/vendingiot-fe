export interface LoginRequest{
   Email:string;
   Password:string; 
}

export interface LoginResponse{
  tokenType:string;
  accessToken:string;
  expiresIn:number;
  email:string;
  fullName:string;
  roles:string[];
  permissions:string[];
}

export interface ApiValidationError{
  message:string;
  errors?:Record<string, string[]>;
}