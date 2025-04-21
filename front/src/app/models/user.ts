export interface User {
    username: string;
    password?: string;
  }
  
  export interface AuthResponse {
    access: string;
    refresh: string;
  }