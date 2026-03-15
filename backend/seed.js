require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Product = require("./models/product");
const Order = require("./models/order");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas connected");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("🧹 Cleared existing data");

    // ─── Users ───────────────────────────────────────
    const users = await User.insertMany([
      {
        name: "Dharan",
        email: "dharan@gmail.com",
        age: 25,
        isActive: true,
        address: { street: "123 Main St", city: "Chennai", zip: "600001" },
      },
      {
        name: "Arun Kumar",
        email: "arun@gmail.com",
        age: 30,
        isActive: true,
        address: { street: "45 Anna Nagar", city: "Chennai", zip: "600040" },
      },
      {
        name: "Priya Sharma",
        email: "priya@gmail.com",
        age: 27,
        isActive: true,
        address: { street: "78 MG Road", city: "Bangalore", zip: "560001" },
      },
      {
        name: "Rahul Verma",
        email: "rahul@gmail.com",
        age: 35,
        isActive: false,
        address: { street: "12 Park Street", city: "Kolkata", zip: "700016" },
      },
      {
        name: "Sneha Nair",
        email: "sneha@gmail.com",
        age: 22,
        isActive: true,
        address: { street: "90 Marine Drive", city: "Mumbai", zip: "400002" },
      },
      {
        name: "Vikram Singh",
        email: "vikram@gmail.com",
        age: 40,
        isActive: false,
        address: { street: "34 Connaught Place", city: "Delhi", zip: "110001" },
      },
      {
        name: "Meera Iyer",
        email: "meera@gmail.com",
        age: 29,
        isActive: true,
        address: { street: "56 T Nagar", city: "Chennai", zip: "600017" },
      },
      {
        name: "Arjun Patel",
        email: "arjun@gmail.com",
        age: 33,
        isActive: true,
        address: { street: "23 CG Road", city: "Ahmedabad", zip: "380006" },
      },
    ]);
    console.log(`👤 Created ${users.length} users`);

    // ─── Products ─────────────────────────────────────
    const products = await Product.insertMany([
      {
        name: "MacBook Pro",
        price: 150000,
        category: "electronics",
        stock: 10,
        isAvailable: true,
      },
      {
        name: "iPhone 15",
        price: 80000,
        category: "electronics",
        stock: 25,
        isAvailable: true,
      },
      {
        name: 'Samsung TV 55"',
        price: 60000,
        category: "electronics",
        stock: 8,
        isAvailable: true,
      },
      {
        name: "Sony Headphones",
        price: 15000,
        category: "electronics",
        stock: 0,
        isAvailable: false,
      },
      {
        name: "Levi's Jeans",
        price: 3000,
        category: "clothing",
        stock: 50,
        isAvailable: true,
      },
      {
        name: "Nike T-Shirt",
        price: 1500,
        category: "clothing",
        stock: 100,
        isAvailable: true,
      },
      {
        name: "Adidas Hoodie",
        price: 4000,
        category: "clothing",
        stock: 0,
        isAvailable: false,
      },
      {
        name: "Basmati Rice 5kg",
        price: 500,
        category: "food",
        stock: 200,
        isAvailable: true,
      },
      {
        name: "Olive Oil 1L",
        price: 800,
        category: "food",
        stock: 75,
        isAvailable: true,
      },
      {
        name: "Dark Chocolate",
        price: 300,
        category: "food",
        stock: 0,
        isAvailable: false,
      },
      {
        name: "Office Chair",
        price: 12000,
        category: "furniture",
        stock: 15,
        isAvailable: true,
      },
      {
        name: "Standing Desk",
        price: 25000,
        category: "furniture",
        stock: 5,
        isAvailable: true,
      },
      {
        name: "Bookshelf",
        price: 8000,
        category: "furniture",
        stock: 0,
        isAvailable: false,
      },
    ]);
    console.log(`📦 Created ${products.length} products`);

    // ─── Orders ───────────────────────────────────────
    const orders = await Order.insertMany([
      // Delivered orders (counts as revenue)
      {
        userId: users[0]._id,
        items: [{ productId: products[0]._id, quantity: 1, price: 150000 }],
        totalAmount: 150000,
        status: "delivered",
        shippingAddress: {
          street: "123 Main St",
          city: "Chennai",
          zip: "600001",
        },
      },
      {
        userId: users[1]._id,
        items: [
          { productId: products[1]._id, quantity: 1, price: 80000 },
          { productId: products[3]._id, quantity: 2, price: 15000 },
        ],
        totalAmount: 110000,
        status: "delivered",
        shippingAddress: {
          street: "45 Anna Nagar",
          city: "Chennai",
          zip: "600040",
        },
      },
      {
        userId: users[2]._id,
        items: [{ productId: products[10]._id, quantity: 2, price: 12000 }],
        totalAmount: 24000,
        status: "delivered",
        shippingAddress: {
          street: "78 MG Road",
          city: "Bangalore",
          zip: "560001",
        },
      },
      {
        userId: users[4]._id,
        items: [{ productId: products[4]._id, quantity: 3, price: 3000 }],
        totalAmount: 9000,
        status: "delivered",
        shippingAddress: {
          street: "90 Marine Drive",
          city: "Mumbai",
          zip: "400002",
        },
      },

      // Shipped orders
      {
        userId: users[3]._id,
        items: [{ productId: products[2]._id, quantity: 1, price: 60000 }],
        totalAmount: 60000,
        status: "shipped",
        shippingAddress: {
          street: "12 Park Street",
          city: "Kolkata",
          zip: "700016",
        },
      },
      {
        userId: users[6]._id,
        items: [{ productId: products[11]._id, quantity: 1, price: 25000 }],
        totalAmount: 25000,
        status: "shipped",
        shippingAddress: {
          street: "56 T Nagar",
          city: "Chennai",
          zip: "600017",
        },
      },

      // Pending orders
      {
        userId: users[5]._id,
        items: [
          { productId: products[5]._id, quantity: 2, price: 1500 },
          { productId: products[6]._id, quantity: 1, price: 4000 },
        ],
        totalAmount: 7000,
        status: "pending",
        shippingAddress: {
          street: "34 Connaught Place",
          city: "Delhi",
          zip: "110001",
        },
      },
      {
        userId: users[7]._id,
        items: [{ productId: products[7]._id, quantity: 5, price: 500 }],
        totalAmount: 2500,
        status: "pending",
        shippingAddress: {
          street: "23 CG Road",
          city: "Ahmedabad",
          zip: "380006",
        },
      },
      {
        userId: users[0]._id,
        items: [{ productId: products[8]._id, quantity: 2, price: 800 }],
        totalAmount: 1600,
        status: "pending",
        shippingAddress: {
          street: "123 Main St",
          city: "Chennai",
          zip: "600001",
        },
      },

      // Cancelled orders
      {
        userId: users[2]._id,
        items: [{ productId: products[9]._id, quantity: 3, price: 300 }],
        totalAmount: 900,
        status: "cancelled",
        shippingAddress: {
          street: "78 MG Road",
          city: "Bangalore",
          zip: "560001",
        },
      },
      {
        userId: users[4]._id,
        items: [{ productId: products[12]._id, quantity: 1, price: 8000 }],
        totalAmount: 8000,
        status: "cancelled",
        shippingAddress: {
          street: "90 Marine Drive",
          city: "Mumbai",
          zip: "400002",
        },
      },
    ]);
    console.log(`🛒 Created ${orders.length} orders`);

    console.log("\n✅ Seed complete! Summary:");
    console.log(
      `   👤 Users     : ${users.length} (${users.filter((u) => u.isActive).length} active, ${users.filter((u) => !u.isActive).length} inactive)`,
    );
    console.log(
      `   📦 Products  : ${products.length} (${products.filter((p) => p.isAvailable).length} available, ${products.filter((p) => !p.isAvailable).length} unavailable)`,
    );
    console.log(
      `   🛒 Orders    : ${orders.length} (${orders.filter((o) => o.status === "delivered").length} delivered, ${orders.filter((o) => o.status === "shipped").length} shipped, ${orders.filter((o) => o.status === "pending").length} pending, ${orders.filter((o) => o.status === "cancelled").length} cancelled)`,
    );
    console.log(
      `   💰 Revenue   : $${orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + o.totalAmount, 0)
        .toLocaleString()} (delivered only)`,
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
