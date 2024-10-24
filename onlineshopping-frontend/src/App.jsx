import Body from "./sections/body/Body";
import Header from "./sections/header/Header";
import SearchResults from "./sections/body/SearchResults";
import Cart from "./sections/cart/Cart";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useCart } from "./sections/cart/useCart";
import { useRef } from "react";
import Popup from "./sections/header/Popup";
import Signin from "./sections/header/Signin";
import Signup from "./sections/header/Signup";
import { UserProvider } from "./sections/userContext";
import Updateinfo from "./sections/header/Updateinfo";
import Historytab from "./sections/header/Historytab";
import Notification from "./sections/body/Notification";

function App() {
  const categoryRefs = useRef({});
  const {
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
  } = useCart(categoryRefs);

  return (
    <UserProvider>
      <Router>
        <Header
          cartCount={cartCount}
          scrollToCategory={scrollToCategory}
          categories={categories}
          contactButton={handleContactClick}
          signInButton={handleSignInClick}
        />
        <Notification />
        <Historytab />
        <Updateinfo />
        <Popup isOpen={isPopupOpen} onClose={handleContactClick} />
        <Signin
          isOpen={isSignInOpen}
          onClose={handleSignInClick}
          onSignUpClick={handleSignUpClick}
        />
        <Signup isOpen={isSignUpOpen} onClose={handleSignUpClick} />
        <Routes>
          <Route
            path="/"
            element={<Body addToCart={addToCart} categoryRefs={categoryRefs} />}
          />
          <Route
            path="/search"
            element={<SearchResults addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                items={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                clearCart={clearCart}
                signin={handleSignInClick}
              />
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
