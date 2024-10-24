import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Signup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState(false);
  const handleSignUp = async (e) => {
    e.preventDefault();
    setSuccessfulMessage(false);
    if (password !== confirmPassword) {
      setErrorMessage("Passwords doesn't match");
      return;
    }
    setErrorMessage("");
    if (Name.length > 12) {
      setErrorMessage("Your Name should not exceed 12 characters");
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

    const response = await fetch(
      "https://e-commerce-website-iw68.onrender.com/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: Name,
          email: email,
          username: userName,
          password: password,
          phone_number: phoneNumber,
          address: address,
        }),
      }
    );

    const data = await response.json();
    if (response.status === 409) {
      setErrorMessage("Email id already exists");
    } else if (response.ok) {
      console.log("Signup successful!", data);
      setSuccessfulMessage(true);

      setName("");
      setEmail("");
      setUserName("");
      setPassword("");
      setConfirmPassword("");
      setPhoneNumber("");
      setAddress("");

      setTimeout(() => {
        setSuccessfulMessage(false);
      }, 4000);
    } else {
      console.error("Signup failed:", data.error);
      setErrorMessage("SignUp failed");
      setSuccessfulMessage(false);
    }
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
          SIGN UP
        </div>
        {errorMessage && (
          <div className="text-red-500 mb-2">{errorMessage}</div> // Display error message
        )}
        {successfulMessage && (
          <div className="text-green-500 mb-2">SignUp Successful!!</div> // Display error message
        )}
        <form
          onSubmit={handleSignUp}
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
              <label htmlFor="email" className="block text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 mt-2 rounded hover:bg-blue-600 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={() => {
            setIsSlidingOut(true);
            setTimeout(onClose, 300);
          }}
          className="mt-4 px-2 py-1  text-white rounded-xl absolute left-[4px] -top-[12px] text-center hover:bg-gray-400/30"
        >
          <ArrowBackIcon style={{ color: "blue" }} />
        </button>
      </div>
    </div>
  );
};

export default Signup;
