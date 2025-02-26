const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const PDF = require("pdfkit");
const { ProductService } = require("../schema/productServiceSchema");

const uploadProductService = (req, res) => {
  try {
    const filePath = path.join(global.rootPath, req.file.path);
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", async (data) => {
        results.push(data);

        await ProductService.insertMany(results, { ordered: false });
      }) // Push each row into results array
      .on("end", async () => {
        try {
          console.log("CSV Data:", results);
        } catch (error) {
          console.log("error in doc.end()", error);
          return res.status(500).json({ msg: "server error" });
        }
      });
  } catch (error) {
    console.log("error in uploadProductService", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const addProductService = async (req, res) => {
  try {
    const { product_service_name, set_up_fee, payment } = req.body;
    if (!product_service_name || !set_up_fee || !payment) {
      return res.send("fill required fields");
    }
    const productService = new ProductService({
      product_service_name,
      set_up_fee,
      payment,
    });
    await productService.save();
    return res
      .status(200)
      .json({ msg: "product successfully added", success: true });
  } catch (error) {
    console.log("error in addProductService", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const updateProductService = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await ProductService.findOne({ _id: productId });
    const { new_product_service_name, new_set_up_fee, new_payment } = req.body;
    product.product_service_name =
      new_product_service_name == "" || new_product_service_name == undefined
        ? product.product_service_name
        : new_product_service_name;
    product.set_up_fee =
      new_set_up_fee == "" || new_set_up_fee == undefined
        ? product.set_up_fee
        : new_set_up_fee;

    product.payment =
      new_payment == "" || new_payment == undefined
        ? product.payment
        : new_payment;
    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    console.log("error in updateProductService", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const getProductsServices = async (req, res) => {
  try {
    const products = await ProductService.find();
    return res.status(200).json(products);
  } catch (error) {
    console.log("error in getProductsServices", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const getProductService = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await ProductService.findOne({ _id: productId });
    return res.status(200).json(product);
  } catch (error) {
    console.log("error in getProductService", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const deleteProductService = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deleteProduct = await ProductService.deleteOne({ _id: productId });
    return res.status(200).json({ msg: "deleted successfully" });
  } catch (error) {
    console.log("error in deleteProductSrevice");
    return res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  uploadProductService,
  addProductService,
  updateProductService,
  getProductsServices,
  getProductService,
  deleteProductService,
};
