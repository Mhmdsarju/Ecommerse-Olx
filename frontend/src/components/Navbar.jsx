import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = ({ search, setSearch }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between gap-6 sticky top-0 z-50">
      <Link to="/home" className="text-2xl font-extrabold text-blue-600">
        OLX
      </Link>

      {setSearch && (
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-lg px-4 py-2 border rounded-lg"
        />
      )}

      <div className="flex items-center gap-4 relative">
        <Link to="/sell">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Sell
          </button>
        </Link>

        <Link to="/cart">
          <button className="relative bg-blue-600 text-white px-4 py-2 rounded-lg">
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>
        </Link>

        {user && (
          <div className="relative">
            <div
              onClick={() => setOpen(!open)}
              className="w-10 h-10 flex items-center justify-center bg-violet-600 text-white font-bold rounded-full cursor-pointer"
            >
              {firstLetter}
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden">
                <Link
                  to="/my-products"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  My Products
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
