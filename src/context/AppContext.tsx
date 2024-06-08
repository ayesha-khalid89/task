// src/context/AppContext.tsx
import React, { createContext, useState, ReactNode } from "react";
import { User, Product } from "../utils/interface";

interface AppContextProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  totalUsers: number;
  setTotalUsers: React.Dispatch<React.SetStateAction<number>>;
  products: Product[];
  totalProducts: number;
  setTotalProducts: React.Dispatch<React.SetStateAction<number>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  return (
    <AppContext.Provider
      value={{
        users,
        totalUsers,
        setTotalUsers,
        setUsers,
        products,
        totalProducts,
        setTotalProducts,
        setProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
