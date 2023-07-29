import mongoose from "mongoose";
import { IUser } from "./user.interface";

export interface IProductInput {
  user: IUser["_id"];
  title: string;
  description: string;
  tags?: string[];
  price: number;
  images: string[];
  offer?: {
    type: number;
    description: string;
  };
  category?: string;
  subCategory?: string;
}

export interface IProduct extends IProductInput, mongoose.Document {
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
