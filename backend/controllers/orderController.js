const Order = require("../models/order");

const getOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("userId")
    .populate("items.productId");
  res.json(orders);
};

const createOrder = async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
};

const deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted" });
};

module.exports = { getOrders, createOrder, deleteOrder };
