// src/types.ts
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    email: string;
    phone: string;
    image: string;
    username: string;
    password: string;
    university: string;
  }
  
  export interface Product {
    id: number;
    title: string;
    brand: string;
    category: string;
    price: number;
  }
  