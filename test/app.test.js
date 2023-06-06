const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index"); // Assuming your main app file is named "app.js"

// Optional: Set up a test database or use a separate database for testing
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/productsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Optional: Clear the test database before each test
beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

// Optional: Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Product API Tests", () => {
  describe("GET /products", () => {
    test("should return an array of products", async () => {
      const response = await request(app).get("/products");
      // Assertions
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /products/:id", () => {
    test("should return a specific product", async () => {
      // Create a product
      const product = await Product.create({
        name: "Test Product",
        price: 10,
        description: "Test description",
        quantity: 5,
        image: "test.jpg",
      });

      const response = await request(app).get(`/products/${product._id}`);
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Test Product");
    });

    test("should return 404 if product not found", async () => {
      const nonExistentId = "nonexistentid";
      const response = await request(app).get(`/products/${nonExistentId}`);
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Product not found");
    });
  });

  // Add more test cases for other API endpoints...
});
