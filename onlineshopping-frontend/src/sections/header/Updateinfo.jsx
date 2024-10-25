import React, { useState } from "react";
import { useUser } from "../userContext";

const Updateinfo = () => {
  const { updateInfo, setUpdateInfo, user } = useUser();
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [Name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState(false);
  if (!updateInfo) return null;

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSuccessfulMessage(false);
    if (password !== confirmPassword) {
      setErrorMessage("Passwords doesn't match");
      return;
    }
    setErrorMessage("");
    if (phoneNumber.length < 10) {
      setErrorMessage("Enter a Valid Mobile Number");
      return;
    }
    setErrorMessage("");
    if (password.length < 8) {
      setErrorMessage("Set password with minimum 8 Characters");
      return;
    }
    setErrorMessage("");

    if (phoneNumber === password) {
      setErrorMessage("Phone number and password cannot be the same.");
      return;
    }
    setErrorMessage("");
    if (Name.length > 12) {
      setErrorMessage("Your Name should not exceed 12 characters");
      return;
    }
    setErrorMessage("");

    const updatedInfo = {
      name: Name,
      username: userName,
      password: password,
      phone_number: phoneNumber,
      address: address,
    };

    try {
      const response = await fetch(
        `https://e-commerce-website-iw68.onrender.com/update/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedInfo),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        handleExitInfo();
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleExitInfo = async () => {
    setIsSlidingOut(true);
    setTimeout(() => {
      setUpdateInfo(false);
      setIsSlidingOut(false);
    }, 300);

    setName("");
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setAddress("");
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div
        className={`bg-gray-100/90 rounded-2xl p-6 shadow-lg w-fit h-fit pb-7 px-7 relative flex flex-col items-center overflow-hidden`}
      >
        <div
          className={`mb-3  ${
            isSlidingOut ? "slide-out fade-out" : "slide-in"
          }`}
        >
          UPDATE INFORMATION
        </div>
        {errorMessage && (
          <div className="text-red-500 mb-2">{errorMessage}</div>
        )}
        {successfulMessage && (
          <div className="text-green-500 mb-2">Updated Successful!!</div>
        )}
        <form
          onSubmit={handleUpdateInfo}
          className={` ${isSlidingOut ? "slide-out" : "slide-in"}`}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-1 border rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-1 border rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phonenumber" className="block text-gray-700">
                Mobile number :
              </label>
              <input
                type="number"
                id="phonenumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-1 border rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className=" text-gray-700">
                Address:
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-1 border rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-1 border rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmpassword" className="block text-gray-700">
                Confirm password:
              </label>
              <input
                type="password"
                id="confirmpassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-1 border rounded mt-1 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 mt-2 rounded hover:bg-blue-600 transition-all duration-300"
          >
            Update
          </button>
        </form>
        <button
          className="mt-4 px-3 py-1 bg-red-600/80 text-white rounded-xl absolute right-[4px] -top-[12px] text-center"
          onClick={handleExitInfo}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Updateinfo;
