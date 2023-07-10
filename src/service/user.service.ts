import { User } from "../models";

export default class UserService {
  public async createUser(input: any) {
    try {
      const user = await User.create(input);
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getUserById(id: string) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getUserByEmail(email: string) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getUserByUsername(username: string) {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getUserByPhoneNumber(phoneNumber: string) {
    try {
      const user = await User.findOne({ phoneNumber });
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async updateUserById(id: string, input: any) {
    try {
      const user = await User.findByIdAndUpdate(id, input, { new: true });
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async deleteUserById(id: string) {
    try {
      const user = await User.findByIdAndDelete(id);
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
