import mongoose from "mongoose";

import { ISession } from "../interfaces/session.interface";
// import UserFingerPrint from "../types/userFingerPrintType";
const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: Array,
    },
  },

  { timestamps: true }
);

const sessionModel = mongoose.model<ISession>("Session", sessionSchema);

export default sessionModel;
