import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Token, Server } from "../src/utilities/";
import { ProductService } from "../src/services";
import ROUTES from "../src/routes/routes.constants";
const app = Server.init();

const userId = new mongoose.Types.ObjectId().toString();

export const products = [
  {
    user: userId,
    title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
    description:
      "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
    price: 879.99,
    images: ["https://i.imgur.com/QlRphfQ.jpg"],
  },
  {
    user: userId,
    title: "Iphone 12 Pro Max",
    description: "",
    price: 1299.99,
    images: [
      "https://i.imgur.com/QlRphfQ.jpg",
      "https://i.imgur.com/QlRphfQ.jpg",
    ],
  },
];

export const userPayload = {
  _id: userId,
  name: "John Muller",
  email: "info@johnmuller.eu",
  username: "johnmuller",
  password: "johnmuller",
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "admin",
  __v: 0,
  countryCode: "+356",
  phoneNumber: "12345678",
  image: ["https://i.imgur.com/QlRphfQ.jpg"],
  gender: true,
  dateOfBirth: new Date().toISOString(),
};

describe("product", () => {
  //  ? * --> Run mango memory server for testing purposes only
  //  ! ** --> So that we don't have to connect to a real database
  beforeAll(async () => {
    const dbServer = await MongoMemoryServer.create();

    await mongoose.connect(dbServer.getUri());
  });
  // ? * --> Disconnect and close the database and server.
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get product route", () => {
    describe("given the product does not exist", () => {
      it("should return a 404", async () => {
        const productId = "invalidId_789877";

        await supertest(app).get(`${ROUTES.PRODUCTS}/${productId}`).expect(404);
      });
    });

    describe("given the product does exist", () => {
      it("should return a 200 status and the product", async () => {
        // @ts-ignore
        const product = await ProductService.create(products[0]);
        console.log(product._id);
        const { body, statusCode } = await supertest(app).get(
          `${ROUTES.PRODUCTS}/${product._id.toString()}`
        );

        expect(statusCode).toBe(200);

        expect(body._id).toBe(product._id);
      });
    });
  });
});
