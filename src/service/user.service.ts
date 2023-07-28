import { UserModel } from "../models";
import { IUserInput } from "../interfaces/user.interface";

async function createUser(input: IUserInput) {
  try {
    const user = await UserModel.create(input);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUserById(id: string) {
  try {
    const user = await UserModel.findById(id);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUserByEmail(email: string) {
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUserByUsername(username: string) {
  try {
    const user = await UserModel.findOne({ username });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUserByPhoneNumber(phoneNumber: string) {
  try {
    const user = await UserModel.findOne({ phoneNumber });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function updateUserById(id: string, input: any) {
  try {
    const user = await UserModel.findByIdAndUpdate(id, input, { new: true });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function deleteUserById(id: string) {
  try {
    const user = await UserModel.findByIdAndDelete(id);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function validatePassword(email: string, password: string) {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) return false;

    const isValid = await user.comparePassword(password);
    if (!isValid) return false;
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getUserByPhoneNumber,
  updateUserById,
  deleteUserById,
  validateUserPassword: validatePassword,
};
