import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProductInDB } from "../redux/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import api from "../api/axios";



const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, watch } = useForm();

  const [pageLoading, setPageLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const [preview, setPreview] = useState(null);

  const imageFile = watch("image");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(
          `/products/${id}`
        );

        if (res.data.soldOut) {
          toast.error("Sold products cannot be edited");
          navigate("/my-products", { replace: true });
          return;
        }

        setValue("title", res.data.title);
        setValue("price", res.data.price);
        setValue("location", res.data.location);
        setPreview(res.data.image);
        setSoldOut(res.data.soldOut);
        setPageLoading(false);
      } catch {
        toast.error("Failed to load product");
        navigate("/my-products", { replace: true });
      }
    };

    fetchProduct();
  }, [id, navigate, setValue]);

  useEffect(() => {
    if (imageFile && imageFile[0]) {
      setPreview(URL.createObjectURL(imageFile[0]));
    }
  }, [imageFile]);

  const onSubmit = (data) => {
    if (soldOut) return;

    setBtnLoading(true);

    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("price", data.price);
    fd.append("location", data.location);
    if (data.image?.[0]) fd.append("image", data.image[0]);

    dispatch(updateProductInDB({ id, data: fd })).then((res) => {
      setBtnLoading(false);

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Product updated successfully ✨");
        navigate("/my-products", { replace: true });
      } else {
        toast.error("Update failed");
      }
    });
  };

  if (pageLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-8 space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Edit Product
        </h2>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border"
          />
        )}

        <div>
          <label className="block text-sm font-semibold mb-1">
            Product Title
          </label>
          <input
            {...register("title")}
            className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter product title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            {...register("price")}
            className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter price"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <input
            {...register("location")}
            className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Change Image (optional)
          </label>
          <input
            type="file"
            {...register("image")}
            accept="image/*"
            className="w-full"
          />
        </div>

        <button
          disabled={btnLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition flex justify-center"
        >
          {btnLoading ? (
            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Update Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
