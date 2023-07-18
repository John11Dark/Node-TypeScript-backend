import { User } from "../models";
import { IUserInput } from "../interfaces/user.interface";

async function createUser(input: IUserInput) {
  try {
    const user = await User.create(input);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUserById(id: string) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUserByEmail(email: string) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUserByUsername(username: string) {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getUserByPhoneNumber(phoneNumber: string) {
  try {
    const user = await User.findOne({ phoneNumber });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function updateUserById(id: string, input: any) {
  try {
    const user = await User.findByIdAndUpdate(id, input, { new: true });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function deleteUserById(id: string) {
  try {
    const user = await User.findByIdAndDelete(id);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function validateUserPassword(email: string, password: string) {
  try {
    const user = await User.findOne({ email });

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
  validateUserPassword,
};
