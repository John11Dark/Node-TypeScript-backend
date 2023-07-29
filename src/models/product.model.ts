import mongoose from "mongoose";
import { IProduct } from "../interfaces/product.interface";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    offer: {
      type: {
        type: Number,
        description: String,
      },
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
  },

  { timestamps: true }
);

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;
