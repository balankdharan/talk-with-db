const express = require("express");
const router = express.Router();
const {
  getOrders,
  createOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
