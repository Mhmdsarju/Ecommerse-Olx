import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { setUserCart } from "../redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/loginSchema.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(setUserCart(res.payload.user._id));
        navigate("/home", { replace: true });
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight block mb-2">
            OLX.Pro
          </Link>
          <p className="text-slate-500">Welcome back. Login to your account.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-8 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-400"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-rose-400 text-sm mt-1.5 px-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-400"
                  {...register("password")}
                />
              </div>
              {errors.password && <p className="text-rose-400 text-sm mt-1.5 px-1">{errors.password.message}</p>}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="text-center text-rose-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group/btn font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300 bg-indigo-600 text-white shadow-indigo-600/30 hover:shadow-indigo-500/50 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-300 disabled:shadow-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Account
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </>
                )}
              </span>
              {!loading && (
                <div className="absolute inset-0 w-full h-full bg-indigo-500 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300 ease-out"></div>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            New to OLX.Pro?{" "}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
