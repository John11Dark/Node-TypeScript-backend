// ? * --> Third parties helpers
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

// ? * --> custom helpers
import { IUser } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 255,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 256,
    },
    username: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 8,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    countryCode: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 5,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: Boolean,
    image: Array,
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next): Promise<void> {
  if (!this.isModified("password")) return next();
  const WORK_FACTOR = config.get<number>("USER_SALT_WORK_FACTOR");
  const SALT = await bcrypt.genSalt(WORK_FACTOR);
  const HASH = await bcrypt.hash(this.password, SALT);
  this.password = HASH;
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<Boolean> {
  return await bcrypt
    .compare(candidatePassword, this.password)
    .catch((_) => false);
};

export default mongoose.model<IUser>("User", userSchema);
