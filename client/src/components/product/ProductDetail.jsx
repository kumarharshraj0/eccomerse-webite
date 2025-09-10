import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import API from "../../utils/API";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/product/${id}`);
        if (isMounted) {
          setProduct(res.data.product);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching product:", err);
          setError("Failed to load product. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <h2 className="text-center my-5">Loading product...</h2>;
  if (error) return <h2 className="text-center my-5 text-danger">{error}</h2>;
  if (!product) return <h2 className="text-center my-5">Product not found</h2>;

  // Handle Buy Now
  const handleBuyNow = () => {
    // Add product to cart
    addToCart(product._id, product.title, product.price, 1, product.imgSrc);
    // Navigate to checkout
    navigate("/checkout");
  };

  return (
    <div className="container text-center my-5 d-flex justify-content-evenly align-items-center">
      <div className="left">
        <img
          src={product.img_src}
          alt={product.title}
          style={{
            width: "250px",
            height: "250px",
            borderRadius: "10px",
            border: "2px solid yellow",
            objectFit: "cover",
          }}
        />
      </div>

      <div className="right text-start">
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <h2 className="text-success fw-bold">
          {product.price} {"₹"}
        </h2>

        <div className="my-5">
          <button
            className="btn btn-danger mx-3 fw-bold"
            onClick={handleBuyNow} // ✅ dynamic Buy Now
          >
            Buy Now
          </button>

          <button
            className="btn btn-warning fw-bold"
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
  );
};

export default ProductDetail;


