// src/pages/Products.tsx
import React, { useContext } from "react";
import DataTable from "../components/DataTable.tsx";
import { AppContext } from "../context/AppContext.tsx";
import { Product } from "../utils/interface.ts";
import { IFilterKeys } from "../utils/interface.ts";

const Products: React.FC = () => {
  const {
    products,
    totalProducts,
    setProducts,
    setTotalProducts,
    productPageSize,
    setProductPageSize,
  } = useContext(AppContext)!;

  const columns: { header: string; accessor: keyof Product }[] = [
    { header: "ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    { header: "Brand", accessor: "brand" },
    { header: "Category", accessor: "category" },
    { header: "Price", accessor: "price" },
    { header: "Discount Percentage", accessor: "discountPercentage" },
    { header: "Rating", accessor: "rating" },
    { header: "Stock", accessor: "stock" },
    { header: "Weight", accessor: "weight" },
    { header: "Warranty Information", accessor: "warrantyInformation" },
    { header: "Availability Status", accessor: "availabilityStatus" },
    { header: "Shipping Information", accessor: "shippingInformation" },
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
      <DataTable<Product>
        columns={columns}
        fetchUrl="https://dummyjson.com/products"
        dataType="products"
        totalData={totalProducts}
        data={products}
        setTotalData={setTotalProducts}
        setData={setProducts}
        filterKeys={filterKeys}
        pageSize={productPageSize}
        setPageSize={setProductPageSize}
      />
    </div>
  );
};

export default Products;
