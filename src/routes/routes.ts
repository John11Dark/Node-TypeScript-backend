import { Express, Request, Response } from "express";
import {
  AuthController,
  UserController,
  ProductController,
} from "../controllers";
import { Validate, Authenticate } from "../middlewares";
import { AuthSchema, ProductSchema, UserSchema } from "../schemas";
import productSchema from "../schemas/product.schema";
import ROUTES from "./routes.constants";

export default function routes(app: Express) {
  // ? This is the default route
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Server is up and running");
  });

  // ? Auth routes
  app.post(
    ROUTES.AUTH_REGISTER,
    Validate(UserSchema.createUserSchema),
    AuthController.registerUserHandler
  );
  app.post(
    ROUTES.AUTH,
    Validate(AuthSchema.LOGIN),
    AuthController.authenticateUserHandler
  );
  app.get(ROUTES.SESSIONS, Authenticate, AuthController.getUserSessionsHandler);

  app.delete(ROUTES.LOGOUT, Authenticate, AuthController.deleteSessionHandler);
  // ? User routes
  app.put(
    ROUTES.Auth_UPDATE,
    [Validate(UserSchema.updateUser), Authenticate],
    UserController.updateUserHandler
  );
  app.delete(
    ROUTES.Auth_DELETE,
    [Validate(UserSchema.deleteUser), Authenticate],
    UserController.deleteUserHandler
  );

  app.get(ROUTES.USERS, Authenticate, UserController.getAllUsersHandler);
  app.get(ROUTES.USER_id, Authenticate, UserController.getUserByIdHandler);
  app.get(
    ROUTES.USER_Query,
    Authenticate,
    UserController.getUserByQueryHandler
  );

  // ? Product routes
  app.post(
    ROUTES.PRODUCTS,
    [Validate(productSchema.createSchema), Authenticate],
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
    [Authenticate, Validate(productSchema.updateSchema)],
    ProductController.update
  );
  app.delete(ROUTES.PRODUCT_id, Authenticate, ProductController.remove);
}
