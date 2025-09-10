import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import TableProduct from "./TableProduct";
// ✅ Import the API instance
import { API } from "../context/AppState";

const Checkout = () => {
  const { cart, userAddress, user, clearCart } = useContext(AppContext);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let qty = 0;
    let price = 0;
    if (cart?.items?.length) {
      cart.items.forEach((item) => {
        qty += item.qty;
        price += item.price;
      });
    }
    setQty(qty);
    setPrice(price);
  }, [cart]);

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // ✅ Use API (so token is auto-attached)
      const orderResponse = await API.post("/payment/checkout", {
        amount: price,
        qty: qty,
        cartItems: cart?.items,
        userShipping: userAddress,
        userId: user._id,
      });

      console.log("Order response:", orderResponse);
      const { orderId, amount: orderAmount } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your key
        amount: orderAmount * 100,
        currency: "INR",
        name: "Web Dev  project",
        description: "Web Dev project",
        order_id: orderId,
        handler: async function (response) {
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: orderAmount,
            orderItems: cart?.items,
            userId: user._id,
            userShipping: userAddress,
          };

          // ✅ Use API (token attached automatically)
          const api = await API.post("/payment/verify-payment", paymentData);
          console.log("Razorpay verify response:", api.data);

          if (api.data.success) {
            clearCart();
            navigate("/orderconfirmation");
          }
        },
        prefill: {
          name: userAddress?.fullName || "Harsh Raj",
          email: user.email,
          contact: userAddress?.phoneNumber || "9000090000",
        },
        notes: {
          address: userAddress?.address || "patna,bihar",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <div className="container my-3">
        <h1 className="text-center">Order Summary</h1>
        <table className="table table-bordered border-primary bg-dark">
          <thead className="bg-dark">
            <tr>
              <th className="bg-dark text-light text-center">Product Details</th>
              <th className="bg-dark text-light text-center">Shipping Address</th>
            </tr>
          </thead>
          <tbody className="bg-dark">
            <tr>
              <td className="bg-dark text-light">
                <TableProduct cart={cart} />
              </td>
              <td className="bg-dark text-light">
                <ul style={{ fontWeight: "bold" }}>
                  <li>Name: {userAddress?.fullName}</li>
                  <li>Phone: {userAddress?.phoneNumber}</li>
                  <li>Country: {userAddress?.country}</li>
                  <li>State: {userAddress?.state}</li>
                  <li>PinCode: {userAddress?.pincode}</li>
                  <li>Near By: {userAddress?.address}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="container text-center my-5">
        <button
          className="btn btn-secondary btn-lg"
          style={{ fontWeight: "bold" }}
          onClick={handlePayment}
        >
          Proceed To Pay
        </button>
      </div>
    </>
  );
};

export default Checkout;


