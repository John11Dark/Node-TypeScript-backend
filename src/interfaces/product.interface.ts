import mongoose from "mongoose";
import { IUser } from "./user.interface";

export interface IProductInput {
  user: IUser["_id"];
  title: string;
  description: string;
  price: number;
  images: string[];
}

export interface IProduct extends IProductInput, mongoose.Document {
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
