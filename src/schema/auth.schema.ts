import { object, string, union } from "zod";

const login = object({
  body: object({
    password: string().min(8, "Password must be at least 8 characters"),
    email: string().email().optional(),
    username: string().optional(),
    phoneNumber: string().optional(),
    authType: union([
      string().refine(
        (data) => ["email", "username", "phoneNumber"].includes(data),
        {
          message: "Invalid auth type",
        }
      ),
      string().optional(),
    ]),
  }).refine(
    (data) => {
      const { authType, email, username, phoneNumber } = data;
      return (
        (authType === "username" && username) ||
        (authType === "email" && email) ||
        (authType === "phoneNumber" && phoneNumber)
      );
    },
    {
      message:
        "Invalid combination of arguments. Please provide the correct arguments based on the 'authType'.",
    }
  ),
});

const forgotPassword = object({
  body: object({
    query: object({
      email: string().email(),
      username: string(),
      phoneNumber: string(),
    }).refine((data) => Object.keys(data).length === 1, {
      message: "Only one query is allowed",
    }),
  }),
});

const resetPassword = object({
  body: object({
    oldPassword: string().min(8, "Password must be at least 8 characters"),
    newPassword: string().min(8, "Password must be at least 8 characters"),
    token: string(),
  }),
});

export default {
  LOGIN: login,
  forgotPassword,
  resetPassword,
};
