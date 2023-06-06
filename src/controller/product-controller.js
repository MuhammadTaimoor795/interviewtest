require("dotenv").config();

const { success, errorResponse } = require("../utils/constants");
const Product = require("../../models/product");
const allProduct = async (req, res, next) => {
  try {
    let product = await Product.find({});
    if (product) {
      return res.status(200).json(success(product, res.statusCode));
    }
  } catch (error) {
    return res.status(500).json(errorResponse(error.message, res.statusCode));
  }
};
const findByIdProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product) {
      return res.status(200).json(success(product, res.statusCode));
    }
  } catch (error) {
    return res.status(500).json(errorResponse(error.message, res.statusCode));
  }
};

const createProduct = async (req, res, next) => {
  const { name, price, description, quantity } = req.body;

  if (!name || !price || !description || !quantity || !req.file) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const product = new Product({
      name,
      price,
      description,
      quantity,
      image: req.file.path,
    });

    let newproduct = await product.save();
    if (newproduct) {
      res.status(201).json(newproduct);
    }
  } catch (error) {
    return res.status(500).json(errorResponse(error.message, res.statusCode));
  }

  // product.save((err, savedProduct) => {
  //   if (err) {
  //     return res.status(500).json({ error: "Internal server error" });
  //   }
  //   res.status(201).json(savedProduct);
  // });
};

const updateProduct = async (req, res, next) => {
  const id = req.params.id;
  const { name, price, description, quantity } = req.body;

  if (!name || !price || !description || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const updatedFields = {
    name,
    price,
    description,
    quantity,
  };

  if (req.file) {
    updatedFields.image = req.file.path;
  }

  try {
    let product = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product) {
      return res.status(200).json(success(product, res.statusCode));
    }
  } catch (error) {
    return res.status(500).json(errorResponse(error.message, res.statusCode));
  }
};

const deletProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    let product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product) {
      return res
        .status(200)
        .json(success("deleted Successfully", res.statusCode));
    }
  } catch (error) {
    return res.status(500).json(errorResponse(error.message, res.statusCode));
  }
};
const bulkUpload = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No CSV file provided" });
  }

  const products = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      const { name, price, description, quantity, image } = row;
      products.push({ name, price, description, quantity, image });
    })
    .on("end", () => {
      // Validate the CSV file format and required columns
      if (
        products.length === 0 ||
        !products[0].name ||
        !products[0].price ||
        !products[0].description ||
        !products[0].quantity
      ) {
        return res.status(400).json({ error: "Invalid CSV file format" });
      }

      // Process and create products in bulk

      Product.insertMany(products, (err, createdProducts) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(201).json(success(createdProducts, res.statusCode));
      });
    });
};

module.exports = {
  allProduct,
  findByIdProduct,
  createProduct,
  updateProduct,
  deletProduct,
  bulkUpload,
};
