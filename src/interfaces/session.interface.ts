import mongoose from "mongoose";
import { IUser } from "./user.interface";
export interface ISession extends mongoose.Document {
  user: IUser["_id"];
  valid: boolean;
  userAgent: Object;
  createdAt: Date;
  updatedAt: Date;
}
