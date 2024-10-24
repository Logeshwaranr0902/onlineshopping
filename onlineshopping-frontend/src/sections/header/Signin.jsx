import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useUser } from "../userContext";

const Signin = ({ onClose, isOpen, onSignUpClick }) => {
  if (!isOpen) return null;
  const { setUserId, setUser, user } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [transition, setTransition] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage(false);

    const response = await fetch("http://127.0.0.1:5000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const userId = data.user.id;
      setUserId(userId);
      console.log("Sign in successful!", data);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 20000);

      const userResponse = await fetch(`http://127.0.0.1:5000/user/${userId}`);

      if (userResponse.ok) {
        const userData = await userResponse.json();

        setUser(userData);
      } else {
        console.error(
          "Failed to fetch user data:",
          userResponse.status,
          userResponse.statusText
        );
      }
    } else {
      console.error("Sign in failed:", data.error);
      setErrorMessage(data.error || "Sign in failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div
        className={`bg-gray-100/90 rounded-2xl p-6 shadow-lg w-fit h-fit pb-7 px-7 relative flex flex-col items-center`}
      >
        <div className={`mb-3  ${transition ? "slide-out " : "slide-in"}`}>
          SIGN IN
        </div>
        {errorMessage && (
          <div className="text-red-500 mb-2">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mb-2">Sign In Successful!!</div>
        )}
        <form
          onSubmit={handleSignIn}
          className={` ${transition ? "slide-out " : "slide-in"}`}
        >
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
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-1 border rounded mt-1 focus:outline-none focus:ring focus:border-blue-300 relative"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle show/hide password
                className={`absolute top-5 right-3  transform -translate-y-1/2 text-blue-500 ${
                  showPassword ? "bg-slate-300 px-[3px] rounded-lg" : ""
                }`}
              >
                <VisibilityIcon style={{ color: "black" }} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-all duration-300"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <button
              onClick={onSignUpClick}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
        <button
          className="mt-4 px-3 py-1 bg-red-600/80 text-white rounded-xl absolute right-[4px] -top-[12px] text-center"
          onClick={() => {
            setTransition(true);
            setTimeout(onClose, 300);
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Signin;
