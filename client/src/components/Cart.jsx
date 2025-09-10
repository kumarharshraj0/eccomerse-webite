import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, decreaseQty, addToCart, removeFromCart, clearCart } =
    useContext(AppContext);
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  // Calculate total quantity and price whenever cart changes
  useEffect(() => {
    let qty = 0;
    let price = 0;

    if (cart?.items?.length) {
      cart.items.forEach((item) => {
        qty += item.qty;
        price += item.price;
      });
    }

    setTotalQty(qty);
    setTotalPrice(price);
  }, [cart]);

  // If cart is empty
  if (!cart?.items?.length) {
    return (
      <div className="text-center my-5">
        <h2>Your Cart is Empty</h2>
        <button
          className="btn btn-warning mx-3"
          style={{ fontWeight: "bold", fontSize: "1.2rem" }}
          onClick={() => navigate("/")}
        >
          Continue Shopping...
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Total Quantity & Price */}
      <div className="my-5 text-center">
        <button
          className="btn btn-info mx-3"
          style={{ fontWeight: "bold", fontSize: "1.2rem" }}
        >
          Total Qty: {totalQty}
        </button>
        <button
          className="btn btn-warning mx-3"
          style={{ fontWeight: "bold", fontSize: "1.2rem" }}
        >
          Total Price: ₹{totalPrice}
        </button>
      </div>

      {/* Cart Items */}
      {cart.items.map((product) => (
        <div
          key={product.productId}
          className="container p-3 bg-dark my-3 text-center text-white"
          style={{ borderRadius: "10px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Product Image */}
            <div className="cart_img">
              <img
                src={product.img_src || product.imgSrc}
                alt={product.title}
                style={{ width: "100px", height: "100px", borderRadius: "10px" }}
              />
            </div>

            {/* Product Details */}
            <div className="cart_des">
              <h2>{product.title}</h2>
              <h4>Price: ₹{product.price}</h4>
              <h4>Qty: {product.qty}</h4>
            </div>

            {/* Actions */}
            <div className="cart_action">
              <button
                className="btn btn-warning mx-2"
                style={{ fontWeight: "bold" }}
                onClick={() => decreaseQty(product.productId, 1)}
              >
                Qty--
              </button>
              <button
                className="btn btn-info mx-2"
                style={{ fontWeight: "bold" }}
                onClick={() =>
                  addToCart(
                    product.productId,
                    product.title,
                    product.price / product.qty,
                    1,
                    product.img_src || product.imgSrc
                  )
                }
              >
                Qty++
              </button>
              <button
                className="btn btn-danger mx-2"
                style={{ fontWeight: "bold" }}
                onClick={() => {
                  if (window.confirm("Are you sure you want to remove this item?")) {
                    removeFromCart(product.productId);
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Checkout & Clear Cart */}
      <div className="container text-center my-3">
        <button
          className="btn btn-warning mx-2"
          style={{ fontWeight: "bold" }}
          onClick={() => navigate("/shipping")}
        >
          Checkout
        </button>
        <button
          className="btn btn-danger mx-2"
          style={{ fontWeight: "bold" }}
          onClick={() => {
            if (window.confirm("Are you sure you want to clear the cart?")) {
              clearCart();
            }
          }}
        >
          Clear Cart
        </button>
      </div>
    </>
  );
};

export default Cart;
