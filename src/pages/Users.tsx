// src/pages/Users.tsx
import React, { useContext } from "react";
import DataTable from "../components/DataTable.tsx";
import { AppContext } from "../context/AppContext.tsx";
import { User } from "../types.ts";
import { IFilterKeys } from "../utils/interface.ts";

const Users: React.FC = () => {
  const { users, setUsers, totalUsers, setTotalUsers } =
    useContext(AppContext)!;

  const columns: { header: string; accessor: keyof User }[] = [
    { header: "ID", accessor: "id" },
    { header: "First Name", accessor: "firstName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Birth Date", accessor: "birthDate" },
    { header: "Gender", accessor: "gender" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Username", accessor: "username" },
    { header: "University", accessor: "university" },
  ];

  const filterKeys: IFilterKeys[] = [
    { title: "Name", key: "firstName", type: "text" },
    { title: "Email", key: "email", type: "text" },
    { title: "Birth Date", key: "birthDate", type: "date" },
    {
      title: "Gender",
      key: "gender",
      type: "select",
      dropdownValues: ["male", "female"],
    },
  ];

  return (
    <div>
      <h1>Users</h1>
      <DataTable<User>
        columns={columns}
        fetchUrl="https://dummyjson.com/users"
        dataType="users"
        setData={setUsers}
        setTotalData={setTotalUsers}
        totalData={totalUsers}
        filterKeys={filterKeys}
      />
    </div>
  );
};

export default Users;
