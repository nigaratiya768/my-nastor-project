const mongoose = require("mongoose");

const productServiceSchema = new mongoose.Schema({
  product_service_name: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  set_up_fee: {
    type: Number,
    default: 0,
    require: true,
    trim: true,
  },
  payment: {
    type: Number,
    require: true,
    default: 0,
    trim: true,
  },
  recurring: {
    type: Number,
    default: 0,
    trim: true,
  },
  billing_cycle: {
    type: String,
    trim: true,
  },
});

const ProductService = mongoose.model(
  "crm_product_service",
  productServiceSchema
);

module.exports = { ProductService };
