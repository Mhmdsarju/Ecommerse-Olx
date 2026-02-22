import express from "express";
import {
  getProducts,
  addProduct,
  getSingleProduct,
  updateProduct,
  checkoutProducts,
} from "../controllers/productController.js";

import upload from "../middlewares/multer.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getSingleProduct);

router.post("/add", auth, upload.single("image"), addProduct);

router.put("/checkout", auth, checkoutProducts);

router.put("/:id", auth, upload.single("image"), updateProduct);

export default router;
