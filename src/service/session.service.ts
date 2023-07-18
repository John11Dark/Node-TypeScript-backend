import { FilterQuery, UpdateQuery } from "mongoose";
import Session from "../models/session.model";
import { ISession } from "../interfaces/session.interface";

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

async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  // const { decoded } = (refreshToken, "refreshTokenPublicKey");

  // if (!decoded || !get(decoded, "session")) return false;

  // const session = await SessionModel.findById(get(decoded, "session"));

  // if (!session || !session.valid) return false;

  // const user = await findUser({ _id: session.user });

  // if (!user) return false;

  // const accessToken = signJwt(
  //   { ...user, session: session._id },
  //   "accessTokenPrivateKey",
  //   { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  // );

  return "";
}

export default {
  create,
  find,
  update,
  reIssueAccessToken,
};
