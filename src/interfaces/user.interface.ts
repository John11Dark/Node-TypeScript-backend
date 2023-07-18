import mongoose from "mongoose";

interface IUserInput {
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  countryCode: string;
  gender: boolean;
  dateOfBirth: Date;
  image: Array<string>;
}

interface IUser extends IUserInput, mongoose.Document {
  isDeleted: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<Boolean>;
}

export type { IUser, IUserInput };
