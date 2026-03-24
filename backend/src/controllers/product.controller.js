import Product from "../models/Product.js";

export const createProduct = async (req, res, next) => {
  try {
    const { farm, name, category, sku, quantity, unitPrice, supplier } = req.body;

    // Validation basique
    if (!farm || !name || !category || !quantity || !unitPrice) {
      const error = new Error("Champs requis manquants: farm, name, category, quantity, unitPrice");
      error.statusCode = 400;
      return next(error);
    }

    const product = new Product({
      farm,
      name,
      category,
      sku,
      quantity,
      unitPrice,
      supplier,
      totalValue: quantity * unitPrice,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    error.statusCode = error.statusCode || 400;
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { farm, category, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (farm) filter.farm = farm;
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .populate("farm")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("farm");
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json(product);
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const data = req.body;
    if (data.quantity || data.unitPrice) {
      data.totalValue = (data.quantity || 0) * (data.unitPrice || 1);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    }).populate("farm");

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json(product);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

export const getLowStockProducts = async (req, res, next) => {
  try {
    const { farm } = req.query;

    let filter = { $expr: { $lte: ["$quantity", "$reorderLevel"] } };
    if (farm) filter.farm = farm;

    const products = await Product.find(filter).populate("farm");
    res.json(products);
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
