import React, { useContext, useState, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";

const SearchProduct = () => {
  const { products, addToCart } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Filter products whenever searchTerm or products change
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const filtered = products?.filter(
      (p) => p?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    setSearchResults(filtered);
  }, [searchTerm, products]);

  return (
    <div className="container my-5 text-center">
      {/* Search Input */}
      <input
        type="text"
        className="form-control w-50 mx-auto mb-4"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Display feedback */}
      {!searchTerm && <p>Start typing to search products...</p>}
      {searchTerm && searchResults.length === 0 && (
        <p>No products found for "{searchTerm}"</p>
      )}

      {/* Results Grid */}
      <div className="row justify-content-center">
        {searchResults.map((product) => (
          <div
            key={product._id}
            className="col-md-4 d-flex justify-content-center my-3"
          >
            <div className="card bg-dark text-light text-center" style={{ width: "18rem" }}>
              <Link
                to={`/product/${product._id}`}
                className="d-flex justify-content-center align-items-center p-3"
              >
                <img
                  src={product.imgSrc || ""}
                  alt={product.title}
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "10px",
                    border: "2px solid yellow",
                    objectFit: "cover",
                  }}
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <div className="my-3 d-flex justify-content-center gap-2">
                  <button className="btn btn-primary">{product.price} ₹</button>
                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      addToCart(
                        product._id,
                        product.title,
                        product.price,
                        1,
                        product.imgSrc
                      )
                    }
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProduct;
