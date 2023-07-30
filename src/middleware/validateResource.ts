import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.strip().parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = validatedData.body;

      next();
    } catch (error: any) {
      return res.status(400).send(error.errors);
    }
  };

export default validate;
