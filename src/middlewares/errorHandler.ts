async function errorHandler(ctx: any, next: any) {
  try {
    await next();
  } catch (err) {}
}

export default {
  errorHandler,
};
