import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart } from "../redux/cartSlice";
import { checkoutProducts, fetchProducts } from "../redux/productSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
        title: "Order Placed Successfully 🎉",
        text: "Your items will be delivered soon!",
        icon: "success",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        navigate("/home", { replace: true });
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      <div className="flex-1 bg-white rounded-xl shadow-md p-5">
        <h2 className="text-3xl font-bold mb-6">Your Cart 🛒</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="flex gap-4 border-b pb-4 mb-4">
              <img
                src={item.image}
                className="w-28 h-28 object-cover rounded"
                alt={item.title}
              />

              <div className="flex-1">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-green-600 font-bold">₹ {item.price}</p>
              </div>

              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="w-80 bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Summary</h2>

        <p className="flex justify-between">
          <span>Total:</span>
          <span className="font-bold text-green-600">₹ {totalPrice}</span>
        </p>

        <button
          onClick={handleCheckout}
          disabled={!cartItems.length}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded disabled:bg-gray-400"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
