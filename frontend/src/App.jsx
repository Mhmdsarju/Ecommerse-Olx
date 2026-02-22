import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

import PrivateRoute from "./components/PrivateRoute";
import PreventAuthRoute from "./components/PreventAuthRoute";
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Sell = lazy(() => import("./pages/Sell"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const MyProducts = lazy(() => import("./pages/MyProducts"));
const EditProduct = lazy(() => import("./pages/EditProduct")); 

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/signup"element={<PreventAuthRoute><Signup /></PreventAuthRoute>}/>
          <Route path="/login"element={<PreventAuthRoute><Login /></PreventAuthRoute>}/>
          <Route path="/home"element={<PrivateRoute><Home /></PrivateRoute>}/>
          <Route path="/sell"element={<PrivateRoute><Sell /></PrivateRoute>}/>
          <Route path="/cart"element={<PrivateRoute><Cart /></PrivateRoute>}/>
          <Route path="/product/:id"element={<PrivateRoute><ProductDetails /></PrivateRoute>}/>
          <Route path="/my-products" element={<PrivateRoute><MyProducts /></PrivateRoute>}/>
          <Route path="/edit-product/:id"element={<PrivateRoute><EditProduct /></PrivateRoute>}/>
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
