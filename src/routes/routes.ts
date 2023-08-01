import { Express, Request, Response } from "express";
import {
  AuthController,
  UserController,
  ProductController,
} from "../controllers";
import { Validate, Authenticate, Files } from "../middlewares";
import { AuthSchema, ProductSchema, UserSchema } from "../schemas";
import ROUTES from "./routes.constants";

export default function routes(app: Express) {
  // ? This is the default route
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Server is up and running");
  });

  // ? Auth routes
  app.post(
    ROUTES.AUTH_REGISTER,
    [
      Files.handleImageUpload,
      Validate(UserSchema.createUserSchema),
      Files.processImages,
    ],
    AuthController.registerUserHandler
  );
  app.post(
    ROUTES.AUTH,
    Validate(AuthSchema.LOGIN),
    AuthController.authenticateUserHandler
  );
  app.get(
    ROUTES.SESSIONS,
    Authenticate.authenticateToken,
    AuthController.getUserSessionsHandler
  );

  app.delete(
    ROUTES.LOGOUT,
    Authenticate.authenticateToken,
    AuthController.deleteSessionHandler
  );
  // ? User routes
  app.put(
    ROUTES.Auth_UPDATE,
    [Validate(UserSchema.updateUser), Authenticate.authenticateToken],
    UserController.updateUserHandler
  );
  app.delete(
    ROUTES.Auth_DELETE,
    [Validate(AuthSchema.deleteUser), Authenticate.authenticateToken],
    UserController.deleteUserHandler
  );

  app.get(
    ROUTES.USERS,
    Authenticate.authenticateToken,
    UserController.getAllUsersHandler
  );
  app.get(
    ROUTES.USER_id,
    Authenticate.authenticateToken,
    UserController.getUserByIdHandler
  );
  app.get(
    ROUTES.USER_Query,
    Authenticate.authenticateToken,
    UserController.getUserByQueryHandler
  );

  // ? Product routes
  app.post(
    ROUTES.PRODUCTS,
    [
      Validate(ProductSchema.createSchema),
      Authenticate.authenticateToken,
      Files.handleImageUpload,
      Files.processImages,
    ],
    ProductController.create
  );
  app.get(
    ROUTES.PRODUCTS,
    Validate(ProductSchema.getSchema),
    ProductController.get
  );
  app.get(
    ROUTES.PRODUCT_id,
    Validate(ProductSchema.getSchema),
    ProductController.find
  );
  app.put(
    ROUTES.PRODUCT_id,
    [Authenticate.authenticateToken, Validate(ProductSchema.updateSchema)],
    ProductController.update
  );
  app.delete(
    ROUTES.PRODUCT_id,
    Authenticate.authenticateToken,
    ProductController.remove
  );
}
