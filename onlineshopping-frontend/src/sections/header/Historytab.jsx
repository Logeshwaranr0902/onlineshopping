import React, { useState, useEffect } from "react";
import { useUser } from "../userContext";
import { categories } from "../../data/categories";

const Historytab = () => {
  const { openHistory, setOpenHistory, userId } = useUser();
  const [cartHistory, setCartHistory] = useState([]);
  const [isOpen, setIsOpen] = useState([]);

  useEffect(() => {
    if (openHistory) {
      fetch(`http://localhost:5000/cart-history/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            setCartHistory(data);
            setIsOpen(Array(data.length).fill(false));
          }
        })
        .catch((error) => console.error("Error fetching cart history:", error));
    }
  }, [openHistory, userId]);

  if (!openHistory) return null;

  const toggleOpen = (index) => {
    setIsOpen((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      console.log(newState);
      return newState;
    });
  };
  const getProductNameById = (id) => {
    for (const category of categories) {
      const product = category.products.find((product) => product.id === id);
      if (product) {
        return product.name; // Return the product name if found
      }
    }
    return null; // Return null if no product is found with the given ID
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="h-[500px] bg-gray-100/90 rounded-2xl p-6 shadow-lg pb-7 px-7 relative flex flex-col items-center w-[700px] overflow-hidden ">
        <div className="">
          <h2 className="text-xl font-bold mb-4">Order Status and History</h2>
          <button
            onClick={() => setOpenHistory(false)}
            className="mt-4 px-3 py-1 bg-red-600/80 text-white rounded-xl absolute right-[4px] -top-[12px] text-center"
          >
            X
          </button>
        </div>
        <div className="flex flex-col mx-7 my-5 w-full h-[550px] overflow-y-auto">
          <div>
            {cartHistory.length === 0 ? (
              <p>No cart history found.</p>
            ) : (
              cartHistory.map((cart, index) => (
                <div
                  key={cart.cart_no}
                  className={`min-h-40 mb-5 rounded-lg bg-gray-400/50 p-4 relative overflow-hidden  ${
                    isOpen[index] ? "h-fit" : "max-h-0"
                  }`}
                >
                  <div className="flex flex-row justify-between">
                    <div className="grid grid-cols-3 gap-1">
                      <p>Order no</p>
                      <span>:</span>
                      <p className="-ml-28">{cart.cart_no}</p>
                      <p>No of Products</p>
                      <span>:</span>
                      <p className="-ml-28">
                        {cart.products.reduce(
                          (total, product) => total + product.quantity,
                          0
                        )}
                      </p>
                      <p>Order Placed on</p>
                      <span>:</span>
                      <p className="-ml-28">{cart.created_at}</p>
                    </div>
                    <div className="flex flex-col justify-between">
                      <h1>
                        Status:{" "}
                        <span className="text-orange-500">To Be Delivered</span>
                      </h1>
                      <h1>
                        Total Amount: ₹ <span>{cart.total_amount}</span>
                      </h1>
                    </div>
                  </div>
                  <p className="mt-3">Products List:</p>

                  <div
                    className={`transition-all duration-300  ${
                      isOpen[index] ? "min-h-fit" : "h-0 overflow-hidden"
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-2 my-8">
                      {cart.products.map((product, i) => (
                        <div
                          key={i}
                          className="flex justify-between  bg-white rounded-lg p-2 shadow-md"
                        >
                          <span>{getProductNameById(product.id)}</span>
                          <div>
                            x<span>{product.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleOpen(index)}
                    className="absolute right-1/2 bottom-2 text-gray-700 hover:text-gray-900 text-center"
                  >
                    {isOpen[index] ? "▲" : "▼"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historytab;
