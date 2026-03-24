import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { farm, name, category, sku, quantity, unitPrice, supplier } =
      req.body;

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
    res.status(400).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("farm");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = req.body;
    if (data.quantity || data.unitPrice) {
      data.totalValue = (data.quantity || 0) * (data.unitPrice || 1);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    }).populate("farm");

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const { farm } = req.query;

    let filter = { $expr: { $lte: ["$quantity", "$reorderLevel"] } };
    if (farm) filter.farm = farm;

    const products = await Product.find(filter).populate("farm");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
