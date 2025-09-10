import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const { products, setFilteredData, logout, isAuthenticated, cart, addToCart } =
    useContext(AppContext);

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? products?.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // On submit, navigate to search page
  const submitHandler = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/product/search/${searchTerm}`);
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  return (
    <div className="nav sticky-top bg-dark text-white">
      <div className="nav_bar d-flex justify-content-between align-items-center px-3 py-2">
        <Link to={"/"} className="left text-white text-decoration-none">
          <h3>MERN E-Commerce</h3>
        </Link>

        {/* Search input */}
        <div className="position-relative" ref={dropdownRef}>
          <form className="d-flex" onSubmit={submitHandler}>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
            />
            <button type="submit" className="btn btn-primary mx-2">
              Search
            </button>
          </form>

          {/* Dropdown for live search */}
          {showDropdown && searchTerm && filteredProducts.length > 0 && (
            <div
              className="position-absolute bg-white text-dark w-100 mt-1 shadow rounded"
              style={{ maxHeight: "300px", overflowY: "auto", zIndex: 1000 }}
            >
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="d-flex justify-content-between align-items-center px-2 py-1 border-bottom"
                >
                  <Link
                    to={`/product/${p._id}`}
                    className="text-dark flex-grow-1"
                    onClick={() => setShowDropdown(false)}
                  >
                    {p.title}
                  </Link>
                  <button
                    className="btn btn-warning btn-sm ms-2"
                    onClick={() => addToCart(p._id, p.title, p.price, 1, p.imgSrc)}
                  >
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>
          )}

          {showDropdown && searchTerm && filteredProducts.length === 0 && (
            <div className="position-absolute bg-white text-dark w-100 mt-1 shadow rounded px-2 py-1">
              No products found
            </div>
          )}
        </div>

        {/* User / Cart */}
        <div className="right d-flex align-items-center">
          {isAuthenticated ? (
            <>
              <Link
                to={"/cart"}
                className="btn btn-primary position-relative mx-2"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {cart?.items?.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cart?.items?.length}
                  </span>
                )}
              </Link>

              <Link to={"/profile"} className="btn btn-info mx-2">
                Profile
              </Link>
              <button
                className="btn btn-danger mx-2"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={"/login"} className="btn btn-secondary mx-2">
                Login
              </Link>
              <Link to={"/register"} className="btn btn-info mx-2">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Sub-bar filters */}
      {location.pathname === "/" && (
        <div className="sub_bar d-flex flex-wrap gap-2 px-3 py-2 bg-secondary text-white">
          <div className="items" onClick={() => setFilteredData(products)}>
            No Filter
          </div>
          <div className="items" onClick={() => setFilteredData(products.filter(p => p.category.toLowerCase() === "mobiles"))}>
            Mobiles
          </div>
          <div className="items" onClick={() => setFilteredData(products.filter(p => p.category.toLowerCase() === "laptops"))}>
            Laptops
          </div>
          <div className="items" onClick={() => setFilteredData(products.filter(p => p.category.toLowerCase() === "cameras"))}>
            Cameras
          </div>
          <div className="items" onClick={() => setFilteredData(products.filter(p => p.category.toLowerCase() === "headphones"))}>
            Headphones
          </div>
          {[15999, 25999, 49999, 69999, 89999].map((price) => (
            <div key={price} className="items" onClick={() => setFilteredData(products.filter(p => p.price >= price))}>
              {price}+
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
