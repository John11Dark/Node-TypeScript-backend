import { Express, Request, Response } from "express";
import { AuthController, UserController } from "../controller";
import { Validate, Authenticate } from "../middleware";
import { AuthSchema, UserSchema } from "../schema/";
import userSchema from "../schema/user.schema";

const PATHS = Object.freeze({
  USERS: "/api/users",
  USER_id: "/api/users/:id",
  USER_Query: "/api/users/:query",
  AUTH_REGISTER: "/auth/register",
  AUTH: "/auth/login",
  Auth_UPDATE: "/auth/update:id",
  Auth_DELETE: "/auth/delete:id",
  LOGOUT: "/auth/Logout",
  SESSIONS: "/api/sessions",
});

export default function routes(app: Express) {
  // ? This is the default route
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Server is up and running");
  });

  // ? Auth routes
  app.post(
    PATHS.AUTH_REGISTER,
    Validate(UserSchema.createUserSchema),
    AuthController.registerUserHandler
  );
  app.post(
    PATHS.AUTH,
    Validate(AuthSchema.login),
    AuthController.authenticateUserHandler
  );
  app.get(PATHS.SESSIONS, Authenticate, AuthController.getUserSessionsHandler);

  app.delete(PATHS.LOGOUT, Authenticate, AuthController.deleteSessionHandler);
  // ? User routes
  app.put(
    PATHS.Auth_UPDATE,
    Validate(userSchema.updateUser),
    Authenticate,
    UserController.updateUserHandler
  );
  app.delete(
    PATHS.Auth_DELETE,
    Validate(userSchema.deleteUser),
    Authenticate,
    UserController.deleteUserHandler
  );

  app.get(PATHS.USERS, Authenticate, UserController.getAllUsersHandler);
  app.get(PATHS.USER_id, Authenticate, UserController.getUserByIdHandler);
  app.get(PATHS.USER_Query, Authenticate, UserController.getUserByQueryHandler);
}
