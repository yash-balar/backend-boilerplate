import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import redisClient from "../config/redis.js";
import { emailQueue } from "../queues/email.queue.js";

export const productController = async (req, res) => {
  console.log(":::::::::::::::", req.query);
  const limit = req.query.limit || 10;
  const cursor = req.query.cursor;
  const search = req.query.search;
  const sortBy = req.query.sortBy || "createdAt";
  const sortByOrder = req.query.sortByOrder;
  // const filterby = "Apple"

  const cacheKey = `products:${limit}:${cursor}:${search}`;
  const existProduct = await redisClient.get(cacheKey);

  if (existProduct) {
    return res.status(200).json({ data: existProduct });
  }

  const filter = {};

  if (cursor) {
    filter._id = {
      $gt: new mongoose.Types.ObjectId(cursor),
    };
  }

  // if (search) {
  //   const regex = new RegExp(search, "i");
  //   filter.$or = [{ name: regex }, { brand: regex }];
  // }

  const sort = {
    [sortBy]: sortByOrder?.toString().toLowerCase() === "asc" ? 1 : -1,
  };

  console.log("filter:::::::::", filter, sort);

  const [product, count] = await Promise.all([
    Product.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "name",
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
                country: 1,
              },
            },
          ],
          as: "products",
        },
      },
      // {
      //   $project: {
      //     _id: 0,
      //     products: {
      //       $filter: {
      //         input: "$products",
      //         as: "product",
      //         cond: {
      //           $gt: ["$$product.price"]
      //         },
      //       },
      //     },
      //   },
      // },
      { $unwind: "$products" },
      { $limit: Number(limit) + 1 },
      // { $sort: sort },
    ]),
    Product.countDocuments(filter),
  ]);

  console.log("product::::::::", product);
  const hasNextPage = product.length > limit;

  const result = hasNextPage ? product.slice(0, limit) : product;

  const nextCursor = hasNextPage
    ? result[result.length - 1]._id.toString()
    : null;

  const totalPages = Math.ceil(count / limit);

  // const job = await emailQueue.add('email-queue', data)

  res.status(200).json({
    message: "data fetch successfully",
    product: result,
    pagination: {
      totalPages: totalPages,
      hasNextPage: hasNextPage,
      nextCursor: nextCursor,
    },
  });
};

export const addProductController = async (req, res) => {
  const response = await Product.create(req.body);
  console.log("response::::::::", response);
};
