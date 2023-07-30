const ROUTES = Object.freeze({
  USERS: "/api/users",
  USER_id: "/api/users/:id",
  USER_Query: "/api/users/:query",
  AUTH_REGISTER: "/auth/register",
  AUTH: "/auth/login",
  Auth_UPDATE: "/auth/update:id",
  Auth_DELETE: "/auth/delete:id",
  LOGOUT: "/auth/Logout",
  SESSIONS: "/api/sessions",
  PRODUCTS: "/api/products",
  PRODUCT_id: "/api/products/:productId",
});

export default ROUTES;
