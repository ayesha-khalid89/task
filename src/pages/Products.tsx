// src/pages/Products.tsx
import React, { useContext } from "react";
import DataTable from "../components/DataTable.tsx";
import { AppContext } from "../context/AppContext.tsx";
import { Product } from "../types.ts"; // Import the Product type
import { IFilterKeys } from "../utils/interface.ts";

const Products: React.FC = () => {
  const { products, totalProducts, setProducts, setTotalProducts } =
    useContext(AppContext)!;

  const columns: { header: string; accessor: keyof Product }[] = [
    { header: "ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    { header: "Brand", accessor: "brand" },
    { header: "Category", accessor: "category" },
    { header: "Price", accessor: "price" },
  ];

  const filterKeys: IFilterKeys[] = [
    { title: "Title", key: "title", type: "text" },
    { title: "Brand", key: "brand", type: "text" },
    {
      title: "Category",
      key: "category",
      type: "select",
      dropdownValues: ["All", "Laptops"],
    },
  ];

  return (
    <div>
      <h1>Products</h1>
      <DataTable<Product>
        columns={columns}
        fetchUrl="https://dummyjson.com/products"
        dataType="products"
        totalData={totalProducts}
        setTotalData={setTotalProducts}
        setData={setProducts}
        filterKeys={filterKeys}
      />
    </div>
  );
};

export default Products;
