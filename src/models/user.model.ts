import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
//
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
    gender: Boolean,
    dateOfBirth: {
      type: Date,
      required: true,
    },
    image: Array,
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next): Promise<void> {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(
    config.get<number>("USER_SALT_WORK_FACTOR")
  );
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<Boolean> {
  return await bcrypt.compare(password, this.password).catch((_) => false);
};

const UserModal = mongoose.model<IUser>("User", userSchema);

export default UserModal;
