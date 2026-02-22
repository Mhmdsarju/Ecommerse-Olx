import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductToDB } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { productSchema } from "../schema/productSchema";

const Sell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.products);

  const [preview, setPreview] = useState(null);

  const {  register,handleSubmit,setValue,formState: { errors },} = useForm({resolver: zodResolver(productSchema),});

  const onSubmit = (data) => {
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("price", data.price);
    fd.append("location", data.location);
    fd.append("image", data.image);

    dispatch(addProductToDB(fd)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Product published 🎉");
        navigate("/home", { replace: true });
      } else {
        toast.error("Failed to publish product");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8 space-y-5"
      >
   
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Sell Your Product
        </h2>


        <div>
          <label className="block font-semibold mb-1">
            Product Title
          </label>
          <input
            {...register("title")}
            placeholder="e.g. iPhone 13"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Price (₹)
          </label>
          <input
            {...register("price")}
            placeholder="e.g. 45000"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Location / Description
          </label>
          <input
            {...register("location")}
            placeholder="e.g. Chennai"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Product Image
          </label>

          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setValue("image", file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
            )}
          </div>

          {errors.image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.image.message}
            </p>
          )}
        </div>

        <button
          disabled={loading}
          className="w-full bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:bg-green-700 transition"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default Sell;
