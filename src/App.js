import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./pages/Users.tsx";
import Products from "./pages/Products.tsx";
import Header from "./components/Header.tsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
