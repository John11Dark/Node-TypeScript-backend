import mongoose from "mongoose";

export interface IUserInput {
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  role: string;
  countryCode: string;
  gender: boolean;
  dateOfBirth: Date;
  password: string;
  image: string;
}

export interface IUser extends IUserInput, mongoose.Document {
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<Boolean>;
}
