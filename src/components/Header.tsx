import React from "react";
import { Link } from "react-router-dom";
import '../index.css'; // Add this line if you want to style your header with CSS

const Header: React.FC = () => {
  return (
    <div className="header">
      <Link to="/users">
        <button>Users</button>
      </Link>
      <Link to="/products">
        <button>Products</button>
      </Link>
    </div>
  );
};

export default Header;
