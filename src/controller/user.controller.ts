import { Request, Response } from "express";
import { UserModel } from "../models";
import { logger } from "../utilities";

async function deleteUserHandler(req: Request, res: Response) {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    return res.status(200).send(user);
  } catch (error) {
    logger.error(error);
  }
}

async function updateUserHandler(req: Request, res: Response) {
  try {
  } catch (e: any) {
    logger.error(e.message);
    throw new Error(e);
  }
}

async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const users = await UserModel.find();
    return res.status(200).send(users);
  } catch (e: any) {
    return res.status(500).send({
      message: "Internal server error",
      error: e.message,
    });
  }
}

async function getUserByIdHandler(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id);
    return res.status(200).send(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(500).send({
      message: "Internal server error",
      error: e.message,
    });
  }
}

async function getUserByQueryHandler(req: Request, res: Response) {
  try {
    const queryParam = req.params.query;

    if (!queryParam || !queryParam.includes("=")) {
      return res
        .status(400)
        .send("Invalid query. Query must be in the format of 'query=value'");
    }

    const [query, value] = queryParam.split("=");
    const queryObject = { [query]: value };
    const user = await UserModel.findOne(queryObject);

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send(user);
  } catch (e: any) {
    return res.status(500).send({
      message: "Internal server error",
      error: e.message,
    });
  }
}
export default {
  deleteUserHandler,
  updateUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  getUserByQueryHandler,
};
