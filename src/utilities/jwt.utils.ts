import Jwt from "jsonwebtoken";
import config from "config";
import { IUser } from "../interfaces/user.interface";

const PRIVATE_KEY = process.env.JWT_SECRET || config.get<string>("JWT_SECRET");
const REFRESH_KEY =
  process.env.JWT_REFRESH_SECRET || config.get<string>("JWT_REFRESH_SECRET");
const PUBLIC_KEY =
  process.env.JWT_PUBLIC_KEY || config.get<string>("JWT_PUBLIC_KEY");
const accessTokenTtl =
  process.env.accessTokenTtl || config.get<string>("accessTokenTtl");
const refreshTokenTtL =
  process.env.refreshTokenTtl || config.get<string>("refreshTokenTtl");

async function generateToken(user: IUser) {
  const newUser = {
    id: user._id,
    email: user.email,
    username: user.username,
    phoneNumber: user.phoneNumber,
    image: user.image,
    isVerified: user.isVerified,
    dob: user.dateOfBirth,
    gender: user.gender,
  };
  try {
    const token = Jwt.sign(newUser, PRIVATE_KEY, { expiresIn: accessTokenTtl });
    return token;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function generateRefreshToken(user: IUser) {
  const newUser = {
    id: user._id,
    email: user.email,
    username: user.username,
    phoneNumber: user.phoneNumber,
    image: user.image,
    isVerified: user.isVerified,
    dob: user.dateOfBirth,
    gender: user.gender,
  };
  try {
    const token = Jwt.sign(newUser, REFRESH_KEY, {
      expiresIn: refreshTokenTtL,
    });
    return token;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function verifyToken(token: string): Promise<IUser> {
  try {
    const user = Jwt.verify(token, PRIVATE_KEY);
    return user as IUser;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
};
