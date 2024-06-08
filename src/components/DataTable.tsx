import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { IFilterKeys } from "../utils/interface.ts";
import { Link } from "react-router-dom";

interface DataTableProps<T> {
  columns: { header: string; accessor: keyof T }[];
  fetchUrl: string;
  dataType: string;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  data: T[];
  setTotalData: React.Dispatch<React.SetStateAction<number>>;
  totalData: number;
  filterKeys: IFilterKeys[];
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

function DataTable<T extends { [key: string]: any }>({
  columns,
  fetchUrl,
  dataType,
  data,
  setData,
  totalData,
  setTotalData,
  filterKeys,
  pageSize,
  setPageSize,
}: DataTableProps<T>) {
  const [selectedFilter, setSelectedFilter] = useState<IFilterKeys>();
  const [inputEnabled, setInputEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredLength, setFilteredLength] = useState(0);
  const [searchClicked, setSearchClicked] = useState(false);
  const searchRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const generateUrl = () => {
    let url = fetchUrl;

    const searchValue = searchRef.current?.value;
    const selectedKey = selectedFilter?.key;
    const selectedType = selectedFilter?.type;

    if (searchValue && !searchValue.includes("Select ")) {
      let value = "";

      if (selectedType === "date" && searchValue) {
        const date = new Date(searchValue);
        value = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
      } else {
        value = searchValue;
      }

      if (value === `Select ${selectedKey}`) {
        value = "";
      }

      if (dataType === "users") {
        url = `${fetchUrl}/filter?key=${selectedKey}&value=${value}`;
      } else {
        if (selectedKey === "category") {
          url = value === "All" ? fetchUrl : `${fetchUrl}/category/laptops`;
        } else {
          url = `${fetchUrl}/search?q=${value}`;
        }
      }
    }
    return url;
  };

  useEffect(() => {
    const url = generateUrl();
    axios
      .get(url, {
        params: {
          limit: pageSize,
          skip: (currentPage - 1) * pageSize,
        },
      })
      .then((response) => {
        if (
          selectedFilter?.key &&
          searchRef?.current?.value &&
          dataType === "products" &&
          selectedFilter?.key !== "category"
        ) {
          const filteredProducts = response.data[dataType]
            .map((item) => {
              if (
                selectedFilter?.key &&
                item[selectedFilter?.key] &&
                item[selectedFilter?.key].includes(searchRef.current?.value)
              ) {
                return item;
              }
            })
            .filter((item) => item !== undefined);
          setData(filteredProducts);
          setTotalData(filteredProducts.length);
        } else {
          setData(response.data[dataType]);
          setTotalData(response.data["total"]);
        }
        setSearchClicked(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      });
  }, [
    currentPage,
    pageSize,
    dataType,
    setData,
    totalData,
    setTotalData,
    selectedFilter,
    searchClicked,
    setData,
    setTotalData,
    setSearchClicked,
    setLoading,
    setError,
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

  const handleDeleteSearch = () => {
    setInputEnabled(false);
    setSearchQuery("");
  };

  const handleDeleteFilter = () => {
    setActiveFilter(null);
    setSelectedFilter(undefined);
    setFilteredLength(0);
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  const handleFilterClick = (item: IFilterKeys) => {
    setActiveFilter(item.title);
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    setFilteredLength(0);
    setSelectedFilter(item);
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
  };

  const totalPages = filteredLength > 0 ? 1 : Math.ceil(totalData / pageSize);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const getPageNumbers = () => {
    const totalNumbers = 5;
    const totalBlocks = totalNumbers + 2;
    if (pageNumbers.length > totalBlocks) {
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(pageNumbers.length - 1, currentPage + 2);
      let pages: any[] = pageNumbers.slice(startPage - 1, endPage);

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = pageNumbers.length - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = Array.from(
            { length: spillOffset },
            (_, i) => startPage - spillOffset + i
          );
          pages = ["...", ...extraPages, ...pages];
          break;
        }
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = Array.from(
            { length: spillOffset },
            (_, i) => endPage + i + 1
          );
          pages = [...pages, ...extraPages, "..."];
          break;
        }
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = ["...", ...pages, "..."];
          break;
        }
      }

      return [1, ...pages, pageNumbers.length];
    }

    return pageNumbers;
  };

  const renderField = () => {
    if (selectedFilter?.type === "text") {
      return (
        <>
          <input
            className="filter-input-field"
            placeholder={`Enter ${selectedFilter.title}...`}
            ref={searchRef as React.RefObject<HTMLInputElement>}
          />
        </>
      );
    } else if (selectedFilter?.type === "select") {
      return (
        <select
          className="filter-select-field"
          ref={searchRef as React.RefObject<HTMLSelectElement>}
          defaultValue={`Select ${selectedFilter.key}`}
        >
          <option value={`Select ${selectedFilter.key}`}>
            Select {selectedFilter.title}
          </option>
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
          className="filter-date-field"
          ref={searchRef as React.RefObject<HTMLInputElement>}
          type="date"
        />
      );
    }
  };
  const renderHeader = () => {
    return (
      <div className="header">
        <Link to="/users">
          <button
            onClick={() => {
              setCurrentPage(1);
              setSelectedFilter(undefined);
              setActiveFilter(null);
            }}
          >
            Users
          </button>
        </Link>
        <Link to="/products">
          <button
            onClick={() => {
              setCurrentPage(1);
              setSelectedFilter(undefined);
            }}
          >
            Products
          </button>
        </Link>
      </div>
    );
  };
  const renderFilterSection = () => {
    return (
      <>
        <div className="section-filter">
          <div>
            <select
              className="select-entries"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            Entries
          </div>
          <div>
            {inputEnabled ? (
              <>
                <input
                  className="search-input-field"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <MdCancel onClick={handleDeleteSearch} />
              </>
            ) : (
              <div style={{ marginTop: 8 }}>
                <CiSearch
                  className="search-icon"
                  size={24}
                  onClick={() => {
                    setInputEnabled(true);
                  }}
                />
              </div>
            )}
          </div>
          <div>
            {filterKeys.map((item) => (
              <button
                className={`custom-button ${
                  activeFilter === item.title ? "active" : ""
                }`}
                onClick={(e) => handleFilterClick(item)}
              >
                {item.title} <span className="arrow-icon"></span>
              </button>
            ))}
          </div>
        </div>
        <div>
          {selectedFilter && (
            <>
              {renderField()}
              <button className="search-button" onClick={handleSearchClick}>
                Search
              </button>
              <MdCancel onClick={handleDeleteFilter} />
            </>
          )}
        </div>
      </>
    );
  };
  const renderDatatable = () => {
    return (
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
      </>
    );
  };
  const renderPagination = () => {
    return (
      <div className="pagination">
        <button
          className="pagination-button prev"
          onClick={() =>
            currentPage > 1
              ? setCurrentPage(currentPage - 1)
              : setCurrentPage(currentPage)
          }
        >
          &larr;
        </button>
        {getPageNumbers().map((number, index) => (
          <button
            key={index}
            className={`pagination-button ${
              number === currentPage ? "active" : ""
            }`}
            onClick={() => setCurrentPage(number)}
            disabled={number === "..."}
          >
            {number}
          </button>
        ))}
        <button
          className="pagination-button next"
          onClick={() =>
            currentPage < pageNumbers.length
              ? setCurrentPage(currentPage + 1)
              : setCurrentPage(currentPage)
          }
        >
          &rarr;
        </button>
      </div>
    );
  };
  return (
    <div>
      {renderHeader()}
      <h2>{dataType.toUpperCase()}</h2>
      {renderFilterSection()}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {renderDatatable()}
          {renderPagination()}
        </>
      )}
    </div>
  );
}

export default DataTable;
