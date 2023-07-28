import { TypeOf, boolean, object, string } from "zod";
const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }).min(3, "Name must be at least 3 characters long"),
    password: string({
      required_error: "Password is required",
    })
      .min(6, "Password must be at least 6 characters long")
      .max(30, "Password must be at most 30 characters long"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    })
      .email("Must be a valid email")
      .min(6, "Email must be at least 6 characters long"),
    username: string({
      required_error: "Username is required",
    })
      .min(6, "Username must be at least 6 characters long")
      .max(30, "Username must be at most 30 characters long"),
    phoneNumber: string({
      required_error: "Phone number is required",
    })
      .min(8, "Phone number must be at least 8 characters long")
      .max(8, "Phone number must be at most 8 characters long"),
    role: string({
      required_error: "Role is required",
    }),
    countryCode: string({
      required_error: "Country code is required",
    })
      .min(2, "Country code must be at least 2 characters long")
      .max(5, "Country code must be at most 5 characters long"),
    gender: boolean({
      required_error: "Gender must be specified",
    }),
    dateOfBirth: string({
      required_error: "Date of birth is required",
    }),
  }),
}).refine((data: any) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

export type CreateUserSchemaType = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;

const deleteUser = object({
  body: object({
    password: string().min(8, "Password must be at least 8 characters"),
    token: string(),
  }),
});

const updateUser = object({});

export default { createUserSchema, deleteUser, updateUser };
