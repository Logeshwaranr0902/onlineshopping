import React, { useState, useEffect, useRef } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useUser } from "../userContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MenuIcon from "@mui/icons-material/Menu"; // Import Menu icon

const Header = ({
  cartCount,
  scrollToCategory,
  categories,
  contactButton,
  signInButton,
}) => {
  const {
    user,
    setUser,
    setUserId,
    setUpdateInfo,
    updateInfo,
    setOpenHistory,
  } = useUser();
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";
  const [query, setQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false); // State for hamburger menu
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const hammenuref = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleCategoryClick = (id) => {
    navigate("/"); // Navigate to the main page
    setTimeout(() => {
      scrollToCategory(id); // Scroll to the category after navigation
    }, 100);
    setShowCategories(false); // Optionally close the categories dropdown
  };

  const handleSignOut = () => {
    setUser(null); // Reset the user state
    setUserId(null);
    navigate("/"); // Redirect to homepage
  };

  const handleUpdateInfo = () => {
    setTimeout(() => {
      setUpdateInfo(!updateInfo);
    }, 100);
    setShowUserMenu(false);
  };

  const handleOpenHistory = () => {
    setOpenHistory((prevstate) => !prevstate);
  };

  const toggleHamburgerMenu = () => {
    setShowHamburgerMenu(!showHamburgerMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategories(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (hammenuref.current && !hammenuref.current.contains(event.target)) {
        setShowHamburgerMenu(false);
      }
    };

    if (showCategories || showUserMenu || showHamburgerMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategories, showUserMenu, showHamburgerMenu]);

  return (
    <header className="border-b bg-blue-400/30 border-gray-500 text-white p-3 fixed top-0 left-0 w-full z-50 backdrop-filter backdrop-blur-[9px]">
      <div className="flex justify-between items-center">
        <button
          className="w-44  py-1 rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            handleCategoryClick(1000);
          }}
        >
          <p className="text-yellow-500 font-cedarville text-xl font-bold pr-2 sm:text-2xl md:text-2xl lg:text-3xl">
            24/7 Mart
          </p>
        </button>
        <form
          onSubmit={handleSearch}
          className="flex items-center border border-white rounded-lg overflow-hidden bg-white/20 w-96"
        >
          <div className="flex border-r border-white/30 items-center p-2">
            <SearchOutlinedIcon className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder=" Enter product name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-2  bg-transparent text-white focus:outline-none"
          />
          {/* Hide the search button on small screens */}
          <button
            type="submit"
            className="hidden  sm:block text-gray-400 rounded-lg border-white border mr-2 px-3 pb-[1px] hover:bg-gray-200 hover:text-black transition-all duration-200"
          >
            Search
          </button>
        </form>
        <div
          className="flex justify-between items-center relative"
          ref={hammenuref}
        >
          {/* Hamburger Menu Button */}
          <button
            className={`sm:hidden p-2 rounded-sm ${
              showHamburgerMenu ? "bg-white text-black" : ""
            } transition-all duration-200`}
            onClick={toggleHamburgerMenu}
          >
            <MenuIcon />
          </button>
          {showHamburgerMenu && (
            <div className="absolute right-0 top-12  bg-gray-800 text-white rounded-lg p-2 shadow-lg w-48">
              <button
                onClick={contactButton}
                className="block w-full text-left p-2 hover:bg-white hover:text-black transition-all duration-200"
              >
                CONTACT
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="block w-full text-left p-2 hover:bg-white hover:text-black transition-all duration-200"
                  onClick={toggleCategories}
                >
                  CATEGORIES
                </button>
                {showCategories && (
                  <ul
                    ref={dropdownRef}
                    className="bg-white/90 text-black rounded-lg p-2 mt-2 h-72 overflow-y-auto"
                  >
                    {categories.map((category) => (
                      <button
                        className={`block w-full text-left border-b border-gray-600 ${
                          showCategories
                            ? "hover:bg-white hover:text-black"
                            : ""
                        }  rounded-md pl-2`}
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </ul>
                )}
              </div>
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="block w-full text-left p-2 hover:bg-white hover:text-black transition-all duration-200"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    Hello, {user.name}
                  </button>
                  {showUserMenu && (
                    <ul className="absolute right-0 mt-2 bg-gray-800 text-white rounded-lg p-2 shadow-lg w-48 z-30">
                      <li
                        onClick={handleUpdateInfo}
                        className="hover:bg-white hover:text-black p-2 cursor-pointer"
                      >
                        Update Information
                      </li>
                      <li
                        className="hover:bg-white hover:text-black p-2 cursor-pointer"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  onClick={signInButton}
                  className="block w-full text-left p-2 hover:bg-white hover:text-black transition-all duration-200"
                >
                  SIGN IN
                </button>
              )}
              <button
                onClick={handleOpenHistory}
                className="block w-full text-left p-2 hover:bg-white hover:text-black transition-all duration-200"
              >
                <EventNoteIcon />
              </button>
              <Link
                to="/cart"
                className={`block w-full text-left p-2 ${
                  isCartPage ? "text-blue-400" : "text-white"
                } hover:text-blue-400 transition-all duration-200 relative`}
              >
                <ShoppingCartOutlinedIcon fontSize="large" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-white/60 backdrop-blur-sm text-black font-bold text-[10px] rounded-full h-5 w-5 flex items-center justify-center transform translate-x-2 -translate-y-2">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}
          {/* Other buttons visible only on larger screens */}
          <div className="hidden sm:flex justify-between items-center">
            <button
              onClick={contactButton}
              className="hover:bg-white rounded-sm hover:text-black p-2 transition-all duration-200"
            >
              CONTACT
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                className="hover:bg-white rounded-sm hover:text-black p-2 transition-all duration-200"
                onClick={toggleCategories}
              >
                CATEGORIES
              </button>
              {showCategories && (
                <ul className="absolute backdrop-filter bg-white/90 backdrop-blur-[9px] h-96 overflow-y-auto text-black mt-2 rounded-lg p-4 shadow-lg space-y-2 w-64">
                  {categories.map((category) => (
                    <button
                      className="text-left block border-b w-full border-gray-600 hover:text-white hover:bg-black rounded-md pl-2"
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </ul>
              )}
            </div>
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="hover:bg-white rounded-sm hover:text-black p-2 transition-all duration-200"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  Hello, {user.name} <ArrowDropDownIcon />
                </button>
                {showUserMenu && (
                  <ul className="absolute right-0 mt-2 bg-gray-800 text-white rounded-lg p-2 shadow-lg w-48">
                    <li
                      onClick={handleUpdateInfo}
                      className="hover:bg-white hover:text-black p-2 cursor-pointer"
                    >
                      Update Information
                    </li>
                    <li
                      className="hover:bg-white hover:text-black p-2 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button
                onClick={signInButton}
                className="hover:bg-white rounded-sm hover:text-black p-2 transition-all duration-200"
              >
                SIGN IN
              </button>
            )}
            <button
              onClick={handleOpenHistory}
              className="hover:bg-white rounded-sm hover:text-black p-2 transition-all duration-200"
            >
              <EventNoteIcon />
            </button>
            <Link
              to="/cart"
              className={`hover:bg-white rounded-sm hover:text-black p-2 transition-all duration-200 relative`}
            >
              <ShoppingCartOutlinedIcon fontSize="large" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-white/60 backdrop-blur-sm text-black font-bold text-[10px] rounded-full h-5 w-5 flex items-center justify-center transform translate-x-2 -translate-y-2">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
