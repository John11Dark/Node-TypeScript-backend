import { Token, logger } from "../utilities";
import { UserModel } from "../models";
import { IUserInput } from "../interfaces/user.interface";
import { SessionService } from ".";
import { FilterQuery, UpdateQuery } from "mongoose";

type LoginInput = {
  query: FilterQuery<{
    email?: string;
    username?: string;
    phoneNumber?: string;
  }>;
  password: string;
};

async function login({ query, password }: LoginInput) {
  try {
    if (Object.keys(query).length !== 1 || query == null) {
      throw new Error("Only one query is required");
    }
    const user = await UserModel.findOne(query);
    logger.info(query);
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const session = await SessionService.create(user._id, "");
    const token = await Token.generateToken(user, session._id);
    return token;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function register(input: IUserInput) {
  try {
    const user = await UserModel.create(input);
    const session = await SessionService.create(user._id, "");
    const token = await Token.generateToken(user, session._id);
    return token;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function logout(token: string) {
  try {
    const { decoded } = await Token.verifyToken(token);
    UserModel.findByIdAndUpdate(decoded.id, {
      token: "",
      refreshToken: "",
      session: "",
      SSDSeS: "",
    });
    return;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function forgotPassword(email: string) {}

async function resetPassword(token: string, password: string) {}

async function verifyEmail(token: string) {}

async function resendVerificationEmail(email: string) {}

async function changePassword(
  token: string,
  oldPassword: string,
  newPassword: string
) {}

async function changeEmail(token: string, password: string, newEmail: string) {}

async function changePhoneNumber(
  token: string,
  password: string,
  newPhoneNumber: string
) {}

async function changeUsername(
  token: string,
  password: string,
  newUsername: string
) {}

export default {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  changePassword,
  changeEmail,
  changePhoneNumber,
  changeUsername,
};
