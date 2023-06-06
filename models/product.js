const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  //   name: String,
  //   price: Number,
  //   description: String,
  //   quantity: Number,
  //   image: String,

  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
