import { number, object, string, TypeOf } from "zod";
const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    })
      .min(5, "Title must be at least 5 characters")
      .max(50, "Title must be at most 50 characters"),
    description: string({
      required_error: "Description is required",
    })
      .min(20, "Description must be at least 20 characters")
      .max(1000, "Description must be at most 1000 characters"),
    price: number({
      required_error: "Price is required",
    }),
    images: string({
      required_error: "Images is required",
    }),
    offer: object({
      type: number({
        required_error: "Type is required",
      }),
      description: string({
        required_error: "Description is required",
      }).optional(),
    }),
    tags: string().optional(),
  }),
};

const params = {
  params: object({
    productId: string({
      required_error: "Product Id is required",
    }),
  }),
};

const createSchema = object({
  ...payload,
});

const updateSchema = object({
  ...params,
  ...payload,
});

const deleteSchema = object({
  ...params,
});

const getSchema = object({
  ...params,
});

export type CreateProductSchemaType = TypeOf<typeof createSchema>;
export type UpdateProductSchemaType = TypeOf<typeof updateSchema>;
export type DeleteProductSchemaType = TypeOf<typeof deleteSchema>;
export type GetProductSchemaType = TypeOf<typeof getSchema>;

export default { createSchema, updateSchema, deleteSchema, getSchema };
