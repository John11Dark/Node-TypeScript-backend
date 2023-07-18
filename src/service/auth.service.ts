import { Token } from "../utilities";
import { User } from "../models";

async function login(input: any) {
  try {
    const user = await User.findOne({ email: input.email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = await Token.generateToken(user);
    return token;
  } catch (error: any) {
    throw new Error(error);
  }
}
async function register(input: any) {
  try {
    const user = await User.create(input);
    const token = await Token.generateToken(user);
    return token;
  } catch (error: any) {
    throw new Error(error);
  }
}
async function logout(token: string) {
  try {
    const decoded = await Token.verifyToken(token);
    User.findByIdAndUpdate(decoded.id, {
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
