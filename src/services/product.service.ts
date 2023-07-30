import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { ProductModel } from "../models";
import { IProduct, IProductInput } from "../interfaces/product.interface";

async function create(input: IProductInput) {
  try {
    const product = await ProductModel.create(input);
    return product;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function find(
  query: FilterQuery<IProduct>,
  options: QueryOptions = {
    lean: true,
  }
): Promise<IProduct | null> {
  try {
    return await ProductModel.findOne(query, null, options);
  } catch (error: any) {
    throw new Error(error);
  }
}

async function update(
  query: FilterQuery<IProduct>,
  update: UpdateQuery<IProduct>,
  options: QueryOptions = { new: true }
) {
  try {
    return ProductModel.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    throw new Error(error);
  }
}

async function remove(query: FilterQuery<IProduct>) {
  try {
    return ProductModel.findOneAndDelete(query);
  } catch (error: any) {
    throw new Error(error);
  }
}

async function get() {
  try {
    return ProductModel.find();
  } catch (error: any) {
    throw new Error(error);
  }
}

export default {
  create,
  find,
  update,
  remove,
  get,
};
