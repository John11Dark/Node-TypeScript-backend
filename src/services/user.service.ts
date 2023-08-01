import { FilterQuery } from "mongoose";
import { UserModel } from "../models";
import { IUserInput } from "../interfaces/user.interface";
import { omit } from "lodash";

async function create(input: IUserInput) {
  try {
    const existingUser = findExistingUser(input);
    if (!existingUser) {
      const user = await UserModel.create(input);
      if (!user)
        throw {
          message: "unknown error occurred",
          statusCode: 401,
          type: "Bad request",
        };
      return omit(user.toJSON(), "password");
    }
  } catch (error: any) {
    throw {
      message: error.message,
      type: error.type ?? "Server error",
      statusCode: error.statusCode ?? 500,
    };
  }
}

async function find(query: FilterQuery<IUserInput>) {
  try {
    const user = await UserModel.findOne(query);
    if (!user)
      throw {
        message: "User not found",
        statusCode: 404,
        type: "Bad request",
      };
    return user;
  } catch (error: any) {
    throw {
      message: error.message,
      type: error.type ?? "Server error",
      statusCode: error.statusCode ?? 500,
    };
  }
}

async function update(id: string, input: any) {
  try {
    const user = await find({
      $or: [
        { _id: id },
        { email: input.email },
        { username: input.username },
        { phoneNumber: input.phoneNumber },
      ],
    });
    if (!user)
      throw { message: "User not found", statusCode: 404, type: "Not found" };
    if (user.email === input.email.toLowerCase() && user._id !== id) {
      throw {
        message: "User with this email already exists",
        type: "email",
        statusCode: 409,
      };
    } else if (
      user.username === input.username.toLowerCase() &&
      user._id !== id
    ) {
      throw {
        message: "User with this username already exists",
        type: "username",
        statusCode: 409,
      };
    } else if (user.phoneNumber === input.phoneNumber && user._id !== id) {
      throw {
        message: "User with this phone number already exists",
        type: "phoneNumber",
        statusCode: 409,
      };
    } else if (!user) {
      throw {
        message: "User not found",
        statusCode: 404,
        type: "Bad request",
      };
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, input, {
      new: true,
    });
    if (!updatedUser) {
      throw {
        message: "unknown error occurred",
        statusCode: 404,
        type: "Bad request",
      };
    }
    return omit(updatedUser.toJSON(), "password");
  } catch (error: any) {
    throw {
      message: error.message,
      type: error.type ?? "Server error",
      statusCode: error.statusCode ?? 500,
    };
  }
}

async function remove(id: string) {
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

async function findExistingUser(input: IUserInput, id?: string): Promise<any> {
  try {
    const { email, username, phoneNumber } = input;
    const existingUser = await find({
      $or: [
        { email: email },
        { username: username },
        { phoneNumber: phoneNumber },
      ],
    });
    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        throw {
          message: "User with this email already exists",
          type: "email",
          statusCode: 409,
        };
      } else if (existingUser.username === username.toLowerCase()) {
        throw {
          message: "User with this username already exists",
          type: "username",
          statusCode: 409,
        };
      } else if (existingUser.phoneNumber === phoneNumber) {
        throw {
          message: "User with this phone number already exists",
          type: "phoneNumber",
          statusCode: 409,
        };
      }
    }

    if (id) {
      if (existingUser._id === id) {
        return existingUser;
      }
    }
    return null;
  } catch (error: any) {
    throw {
      message: error.message,
      type: error.type ?? "Server error",
      statusCode: error.statusCode ?? 500,
    };
  }
}

export default {
  create,
  find,
  update,
  remove,
  validatePassword,
};
