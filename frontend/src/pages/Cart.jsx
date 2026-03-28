import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart } from "../redux/cartSlice";
import { checkoutProducts, fetchProducts } from "../redux/productSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getImageUrl } from "../utils/imageUtils";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const handleCheckout = async () => {
    const productIds = cartItems.map((item) => item._id);

    const res = await dispatch(checkoutProducts(productIds));

    if (res.meta.requestStatus === "fulfilled") {
      dispatch(clearCart());

      await dispatch(fetchProducts());

      Swal.fire({
        title: "Order Placed! 🎉",
        text: "Your luxury items will be delivered soon.",
        icon: "success",
        background: "#ffffff",
        color: "#0f172a",
        confirmButtonColor: "#4f46e5",
      }).then(() => {
        navigate("/home", { replace: true });
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-28 pb-12 px-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-8">
          Your Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-lg p-6 lg:p-8">

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h3>
                <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <button
                  onClick={() => navigate('/home')}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors group">
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                      <img
                        src={getImageUrl(item.image)}
                        className="w-full h-full object-cover rounded-xl shadow-md"
                        alt={item.title}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">{item.title}</h3>
                      <p className="text-emerald-600 font-extrabold text-lg">₹ {item.price.toLocaleString("en-IN")}</p>
                      {item.location && <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>{item.location}</p>}
                    </div>

                    <div className="flex items-center sm:justify-end">
                      <button
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="p-3 text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 lg:p-8 sticky top-28">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-slate-800 font-semibold">₹ {totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
                  <span className="text-lg font-medium text-slate-800">Total</span>
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    ₹ {totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!cartItems.length}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                {!cartItems.length === 0 && (
                  <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Secure Checkout Powered by OLX.Pro
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
