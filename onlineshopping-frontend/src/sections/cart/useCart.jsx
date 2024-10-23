import { useState } from "react";

export const useCart = (categoryRefs) => {
  const [cartItems, setCartItems] = useState([]);
  const clearCart = () => {
    setCartItems([]);
  };

  const addToCart = (product) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);

    if (existingProduct) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...existingProduct, quantity: existingProduct.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Calculate the cart count dynamically based on the quantity of items
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const scrollToCategory = (id) => {
    if (categoryRefs.current[id]) {
      const element = categoryRefs.current[id].current;
      const { top } = element.getBoundingClientRect();
      const scrollY = window.scrollY; // Current scroll position
      const targetPosition = scrollY + top - 76; // Adjust for the common offset

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };
  const categories = [
    { id: 1000, name: "FRUITS" },
    { id: 1002, name: "DAIRY PRODUCTS" },
    { id: 1004, name: "MEAT AND POULTRY" },
    { id: 1006, name: "SEAFOOD" },
    { id: 1008, name: "BAKERY ITEMS" },
    { id: 1010, name: "GRAINS AND PASTA" },
    { id: 1012, name: "FROZEN FOODS" },
    { id: 1014, name: "SNACKS AND CONFECTIONERY" },
    { id: 1016, name: "BEVERAGES" },
    { id: 1018, name: "HEALTH AND BEAUTY PRODUCTS" },
    { id: 1020, name: "HOUSEHOLD SUPPLIES" },
    { id: 1022, name: "PERSONAL CARE ITEMS" },
    { id: 1024, name: "BABY CARE PRODUCTS" },
    { id: 1026, name: "CANNED AND PACKAGED GOODS" },
    { id: 1028, name: "PET SUPPLIES" },
    { id: 1030, name: "KITCHEN SUPPLIES" },
    { id: 1032, name: "HOME DECOR" },
  ];

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleContactClick = () => {
    setIsPopupOpen((prevState) => !prevState);
  };

  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleSignInClick = () => {
    setIsSignInOpen((prevState) => !prevState);
  };

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpOpen((prevState) => !prevState);
    setIsSignInOpen((prevState) => !prevState);
  };

  return {
    cartCount,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    scrollToCategory,
    categories,
    isPopupOpen,
    isSignInOpen,
    isSignUpOpen,
    handleSignUpClick,
    handleSignInClick,
    handleContactClick,
    clearCart,
  };
};
