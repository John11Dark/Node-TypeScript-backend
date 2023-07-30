import { FilterQuery, UpdateQuery } from "mongoose";
import Session from "../models/session.model";
import { ISession } from "../interfaces/session.interface";
import { Token } from "../utilities";
import { UserModel } from "../models";

async function create(userId: string, userAgent: Object) {
  try {
    const session = await Session.create({
      user: userId,
      userAgent,
    });
    return session.toJSON();
  } catch (error: any) {
    throw new Error(error);
  }
}

async function find(query: FilterQuery<ISession>) {
  return Session.find(query).lean();
}

async function update(
  query: FilterQuery<ISession>,
  update: UpdateQuery<ISession>
) {
  return Session.updateOne(query, update);
}

async function reIssueAccessToken(
  refreshToken: string
): Promise<string | null> {
  try {
    const { sessionId } = await Token.verifyToken(refreshToken);

    if (sessionId) {
      return null;
    }

    const session = await Session.findOne({ _id: sessionId });

    if (!session || !session.valid) {
      return null;
    }

    const user = await UserModel.findById(session.user);

    if (!user) {
      return null;
    }

    const accessToken = await Token.generateToken(user, session._id);

    return accessToken;
  } catch (error) {
    console.error("Error in reIssueAccessToken:", error);
    return null;
  }
}

export default {
  create,
  find,
  update,
  reIssueAccessToken,
};
