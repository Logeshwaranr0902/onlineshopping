import React, { useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useUser } from "../userContext";
import { Link } from "react-router-dom";

const Cart = ({ items, removeFromCart, updateQuantity, clearCart, signin }) => {
  const { user } = useUser();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const totalPrice = items.reduce((total, item) => {
    const priceNumber = parseFloat(item.price.replace(/[^\d.-]/g, ""));
    return total + priceNumber * item.quantity;
  }, 0);

  // Calculate GST, delivery charge, and service fee only if there are items in the cart
  const gst = items.length > 0 ? totalPrice * 0.18 : 0;
  const deliveryCharge = items.length > 0 ? (totalPrice > 500 ? 0 : 50) : 0;
  const serviceFee = items.length > 0 ? 30 : 0;
  const totalPayable = totalPrice + gst + deliveryCharge + serviceFee;

  const handleCheckout = async () => {
    if (!user || !user.id) {
      setErrorMessage(true);
      setTimeout(() => {
        signin();
      }, 1000);

      return;
    }
    const userId = user.id;

    console.log("the user id is", userId);

    const checkoutData = {
      userId,
      items,
      totalPrice: totalPayable, // Send the total payable amount
    };

    try {
      const response = await fetch(
        "https://e-commerce-website-iw68.onrender.com/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkoutData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result.message);
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  if (orderSuccess) {
    return (
      <div className=" bg-gradient-to-r from-[#1c2444]  via-[#0c1771] to-[#160e33] min-h-screen text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
        <p className="mt-4">Thank you for your order!</p>
        <p>
          Please Return to{" "}
          <Link to="/" className="hover:underline hover:text-blue-400">
            Home page!
          </Link>{" "}
        </p>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-r from-[#1c2444]  via-[#0c1771] to-[#160e33] min-h-screen text-white flex flex-col">
      <div className="pt-24 px-4 flex flex-row flex-grow">
        {/* Left Column: Cart Items */}
        <div className="w-2/3 overflow-y-auto">
          <h1 className="text-2xl font-bold">SHOPPING CART</h1>
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-row justify-between bg-gray-800 p-4 rounded-lg border border-gray-700 mb-2"
                >
                  <div className="flex flex-col w-2/3">
                    <span className="mb-4">{item.name}</span>
                    <span className="mb-4">Quantity: {item.quantity}</span>
                    <span className="">{item.price}</span>
                  </div>
                  <div className="flex flex-col w-1/3 justify-between py-3 gap-3">
                    <button
                      className="border rounded-xl bg-red-500 border-black mx-4 py-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                    <div className="flex justify-center">
                      <button
                        className="border border-black rounded-l-lg px-[8px] py-[3px] bg-gray-300 text-red-600"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          } else {
                            removeFromCart(item.id);
                          }
                        }}
                      >
                        <RemoveIcon />
                      </button>
                      <span className="bg-white text-black pt-1 border-black border-y px-3">
                        {item.quantity}
                      </span>
                      <button
                        className="border border-black rounded-r-lg px-[8px] py-[3px] bg-gray-300 text-blue-600"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <AddIcon />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Column: Total Price and Charges */}
        {items.length > 0 ? (
          <div className="w-1/3 ml-4 bg-gray-800 p-4 h-auto rounded-lg border border-gray-700 ">
            <h2 className="text-2xl pb-4 font-bold">AMOUNT SUMMARY</h2>
            {errorMessage ? (
              <p className="text-center text-red-600 mb-3">
                Before checkout please signin!!
              </p>
            ) : (
              ""
            )}
            <div className="border bg-gray-600 rounded-md p-4 gap-3 grid grid-cols-3 ">
              <span className="text-lg">Subtotal</span>
              <span className="text-lg">:</span>
              <span className="text-lg text-right">
                ₹{totalPrice.toFixed(2)}
              </span>

              <span className="text-lg">GST (18%)</span>
              <span className="text-lg">:</span>
              <span className="text-lg text-right">₹{gst.toFixed(2)}</span>
              <span className="text-lg ">Delivery Charge</span>
              <span className="text-lg">:</span>
              <span className="text-lg text-right">
                ₹{deliveryCharge.toFixed(2)}
              </span>
              <span className="text-lg">Service Fee</span>
              <span className="text-lg">:</span>
              <span className="text-lg text-right">
                ₹{serviceFee.toFixed(2)}
              </span>

              <span className="text-lg font-bold">Total Payable</span>
              <span className="text-lg font-bold">:</span>
              <span className="text-lg font-bold text-right">
                ₹{totalPayable.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-500  text-white py-3 mt-6 rounded hover:bg-blue-600 transition-all duration-300 "
            >
              CHECKOUT
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Cart;
