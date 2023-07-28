import { object, string } from "zod";

const login = object({
  body: object({
    query: object({
      email: string().email(),
      username: string(),
      phoneNumber: string(),
    }).refine((data) => Object.keys(data).length === 1, {
      message: "Only one query is allowed",
    }),
    password: string().min(8, "Password must be at least 8 characters"),
  }),
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
  login,
  forgotPassword,
  resetPassword,
};
