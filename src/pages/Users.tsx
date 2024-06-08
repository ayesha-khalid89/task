// src/pages/Users.tsx
import React, { useContext } from "react";
import DataTable from "../components/DataTable.tsx";
import { AppContext } from "../context/AppContext.tsx";
import { User } from "../utils/interface.ts";
import { IFilterKeys } from "../utils/interface.ts";

const Users: React.FC = () => {
  const {
    users,
    setUsers,
    totalUsers,
    setTotalUsers,
    userPageSize,
    setUserPageSize,
  } = useContext(AppContext)!;

  const columns: { header: string; accessor: keyof User }[] = [
    { header: "ID", accessor: "id" },
    { header: "First Name", accessor: "firstName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Maiden Name", accessor: "maidenName" },
    { header: "Birth Date", accessor: "birthDate" },
    { header: "Gender", accessor: "gender" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Username", accessor: "username" },
    { header: "Height", accessor: "height" },
    { header: "Blood Group", accessor: "bloodGroup" },
    { header: "Eye Color", accessor: "eyeColor" },
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
      <DataTable<User>
        columns={columns}
        fetchUrl="https://dummyjson.com/users"
        dataType="users"
        setData={setUsers}
        data={users}
        setTotalData={setTotalUsers}
        totalData={totalUsers}
        filterKeys={filterKeys}
        pageSize={userPageSize}
        setPageSize={setUserPageSize}
      />
    </div>
  );
};

export default Users;
