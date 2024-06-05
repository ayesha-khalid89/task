import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { IFilterKeys } from "../utils/interface.ts";

interface DataTableProps<T> {
  columns: { header: string; accessor: keyof T }[];
  fetchUrl: string;
  dataType: string;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setTotalData: React.Dispatch<React.SetStateAction<number>>;
  totalData: number;
  filterKeys: IFilterKeys[];
}

function DataTable<T extends { [key: string]: any }>({
  columns,
  fetchUrl,
  dataType,
  setData,
  totalData,
  setTotalData,
  filterKeys,
}: DataTableProps<T>) {
  const [selectedFilter, setSelectedFilter] = useState<IFilterKeys>();
  const [inputEnabled, setInputEnabled] = useState(false);
  const [data, setDataState] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredLength,setFilteredLength]= useState(0);
  const searchRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    axios
      .get(fetchUrl, {
        params: {
          limit: pageSize,
          skip: (currentPage - 1) * pageSize,
        },
      })
      .then((response) => {
        setData(response.data[dataType]);
        setDataState(response.data[dataType]);
        if (totalData === 0) {
          setTotalData(response.data["total"]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      });
  }, [
    fetchUrl,
    currentPage,
    pageSize,
    dataType,
    setData,
    totalData,
    setTotalData,
    selectedFilter
  ]);

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(item[column.accessor]).toLowerCase().includes(searchQuery)
    )
  );

  

  const displayData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteSearch = () => {
    setInputEnabled(false);
    setSearchQuery("");
  };

  const handleFilterClick = (item: IFilterKeys) => {
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    setFilteredLength(0)
    setSelectedFilter(item);
  };

  const renderField = () => {
    console.log(selectedFilter?.type);
    if (selectedFilter?.type === "text") {
      return (
        <>
          <input
            placeholder={`Enter ${selectedFilter.title}...`}
            ref={searchRef as React.RefObject<HTMLInputElement>}
          ></input>
        </>
      );
    } else if (selectedFilter?.type === "select") {
      console.log("select");
      return (
        <select
          ref={searchRef as React.RefObject<HTMLSelectElement>}
          defaultValue="Select gender"
        >
          <option value="Select gender">Select gender</option>
          {selectedFilter?.dropdownValues?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      );
    } else if (selectedFilter?.type === "date") {
      return (
        <input
          ref={searchRef as React.RefObject<HTMLInputElement>}
          type="date"
        />
      );
    }
  };
  const handleSearchClick = () => {
    let value = ""
    if (selectedFilter?.type === "date" && searchRef.current) {
        const date = new Date(searchRef.current.value);
        value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      } else if (searchRef.current){
        value = searchRef.current.value;
      }
    if (value == "Select gender" && searchRef.current){
        value=""
    }
    if (selectedFilter?.key && value) {
        const url = `${fetchUrl}/filter?key=${selectedFilter.key}&value=${value}`;
        axios
        .get(url)
        .then((response) => {
            setDataState(response.data[dataType]);
            setFilteredLength(response.data["total"])
            setDataState(response.data[dataType] || []);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setError("Error fetching data");
            setLoading(false);
          });
      }
    console.log(value, selectedFilter?.key);
  };
  
  const totalPages = filteredLength > 0 ? 1 : Math.ceil(totalData / pageSize);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {filteredLength<1 ? <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>: `${filteredLength} ` }
          Entries
        </div>
        <div>
          {filterKeys.map((item) => (
            <button onClick={(e) => handleFilterClick(item)}>
              {item.title}
            </button>
          ))}
        </div>

        <div>
          {inputEnabled ? (
            <>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <MdCancel onClick={handleDeleteSearch} />
            </>
          ) : (
            <CiSearch
              onClick={() => {
                setInputEnabled(true);
              }}
            />
          )}
        </div>
      </div>
      <div>
        {selectedFilter && (
          <>
            {renderField()}
            <button onClick={handleSearchClick}>Search</button>
          </>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={String(column.header)}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={String(column.header)}>
                      {String(row[column.accessor])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() =>
                currentPage > 1
                  ? setCurrentPage(currentPage - 1)
                  : setCurrentPage(currentPage)
              }
            >
              Prev
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor:
                    number === currentPage ? "#fdc936" : "#c0e3e5",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() =>
                currentPage < pageNumbers.length
                  ? setCurrentPage(currentPage + 1)
                  : setCurrentPage(currentPage)
              }
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DataTable;
