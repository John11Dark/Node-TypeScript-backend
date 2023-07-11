import mongoose from "mongoose";
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  role: string;
  isDeleted: boolean;
  isVerified: boolean;
  countryCode: string;
  gender: boolean;
  dateOfBirth: Date;
  image: Array<string>;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<Boolean>;
}
