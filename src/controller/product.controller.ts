import { Response, Request } from "express";
import {
  CreateProductSchemaType,
  DeleteProductSchemaType,
  GetProductSchemaType,
  UpdateProductSchemaType,
} from "../schema/product.schema";

import { ProductService } from "../service";

async function create(
  req: Request<{}, {}, CreateProductSchemaType["body"]>,
  res: Response
) {
  try {
    const userId = res.locals.user._id;
    const { title, description, price, images, offer, tags } = req.body;
    const product = await ProductService.create({
      user: userId,
      title,
      description,
      price,
      images,
      offer,
      tags,
    });
    return res.status(201).send({
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function find(
  req: Request<GetProductSchemaType["params"], null, null>,
  res: Response
) {
  const { productId } = req.params;
  const product = await ProductService.find({ productId });
  if (!product)
    return res.status(404).send({
      message: "Product not found",
    });
  return res.status(200).send(product);
}

async function update(
  req: Request<
    UpdateProductSchemaType["params"],
    null,
    UpdateProductSchemaType["body"]
  >,
  res: Response
) {
  const userId = res.locals.user._id;
  const { productId } = req.params;
  const { title, description, price, images, offer, tags } = req.body;

  const product = await ProductService.find({ productId });
  if (!product)
    return res.status(404).send({
      message: "Product not found",
    });

  if (product.user.toString() !== userId.toString())
    return res.status(403).send({
      message: "You are not authorized to update this product",
    });

  try {
    const updatedProduct = await ProductService.update(
      { productId },
      {
        userId,
        title,
        description,
        price,
        images,
        offer,
        tags,
      },
      {
        new: true,
      }
    );
    return res.status(200).send({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {}
}

async function remove(
  req: Request<DeleteProductSchemaType["params"], null, null>,
  res: Response
) {
  const userId = res.locals.user._id;
  const { productId } = req.params;

  const product = await ProductService.find({ productId });
  if (!product)
    return res.status(404).send({
      message: "Product not found",
    });

  if (product.user.toString() !== userId.toString())
    return res.status(403).send({
      message: "You are not authorized to delete this product",
    });

  try {
    await ProductService.remove({ productId });
    return res.status(200).send({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
}

async function get(req: Request<{}, null, null>, res: Response) {
  try {
    const products = await ProductService.get();
    return res.status(200).send(products);
  } catch (error: any) {
    return res.status(500).send({
      message: error.message,
    });
  }
}

export default {
  create,
  find,
  update,
  remove,
  get,
};
