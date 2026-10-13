import express from "express";
import {
  addProductController,
  productController,
} from "../controllers/product.controller.js";
import { rateLimiter } from "../middleweres/rate.limiter.js";
import { authMiddlewere } from "../middleweres/auth.middlewere.js";
import {
  addUserController,
  deleteUserController,
  getUserController,
  updateUserController,
} from "../controllers/user.controller.js";
import { uploadSingle } from "../middleweres/upload.js";

const router = express.Router();

router.get("/products", productController);

router.post("/products", addProductController);

// router.post("/profile", uploadSingle, (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({
//       message: "Please upload an image",
//     });
//   }

//   res.status(201).json({
//     message: "Profile image uploaded",
//     image: `/uploads/${req.file.filename}`,
//   });
// });

// router.post("/products", uploadMultiple, (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({
//       message: "Please upload at least one image",
//     });
//   }

//   const images = req.files.map(
//     (file) => `/uploads/${file.filename}`
//   );

//   res.status(201).json({
//     message: "Product images uploaded",
//     images,
//   });
// });

router.get("/users", getUserController);

router.post("/users", addUserController);

router.put("/users/:id", updateUserController);

router.delete("/users/:id", deleteUserController);

export default router;
