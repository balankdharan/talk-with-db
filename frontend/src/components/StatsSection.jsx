import { useEffect, useState } from "react";
import {
  SimpleGrid,
  Box,
  Text,
  Heading,
  Spinner,
  Center,
  Button,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

function StatCard({ label, value, help, color }) {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={4}
      shadow="sm"
      borderTop="3px solid"
      borderColor={color}
    >
      <Text color="gray.500" fontSize="xs" mb={1}>
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        {value ?? 0}
      </Text>
      <Text color="gray.400" fontSize="xs" mt={1}>
        {help}
      </Text>
    </Box>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${BASE_URL}/users`),
          axios.get(`${BASE_URL}/products`),
          axios.get(`${BASE_URL}/orders`),
        ]);

        const users = usersRes.data;
        const products = productsRes.data;
        const orders = ordersRes.data;

        const activeUsers = users.filter((u) => u.isActive).length;
        const inactiveUsers = users.filter((u) => !u.isActive).length;
        const availableProducts = products.filter((p) => p.isAvailable).length;
        const outOfStock = products.filter((p) => p.stock === 0).length;
        const categoryCount = [...new Set(products.map((p) => p.category))]
          .length;
        const pendingOrders = orders.filter(
          (o) => o.status === "pending",
        ).length;
        const deliveredOrders = orders.filter(
          (o) => o.status === "delivered",
        ).length;
        const cancelledOrders = orders.filter(
          (o) => o.status === "cancelled",
        ).length;
        const shippedOrders = orders.filter(
          (o) => o.status === "shipped",
        ).length;
        const totalRevenue = orders
          .filter((o) => o.status === "delivered")
          .reduce((sum, o) => sum + o.totalAmount, 0);

        setStats({
          totalUsers: users.length,
          activeUsers,
          inactiveUsers,
          totalProducts: products.length,
          availableProducts,
          outOfStock,
          categoryCount,
          totalOrders: orders.length,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          shippedOrders,
          totalRevenue,
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers,
      help: "Registered users",
      color: "blue.400",
    },
    {
      label: "Active Users",
      value: stats?.activeUsers,
      help: "Currently active",
      color: "blue.600",
    },
    {
      label: "Inactive Users",
      value: stats?.inactiveUsers,
      help: "Deactivated accounts",
      color: "gray.400",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts,
      help: "In catalog",
      color: "green.400",
    },
    {
      label: "Available Products",
      value: stats?.availableProducts,
      help: "In stock & available",
      color: "green.600",
    },
    {
      label: "Out of Stock",
      value: stats?.outOfStock,
      help: "Stock is 0",
      color: "red.400",
    },
    {
      label: "Categories",
      value: stats?.categoryCount,
      help: "Unique categories",
      color: "teal.400",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders,
      help: "All time orders",
      color: "orange.400",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders,
      help: "Awaiting processing",
      color: "yellow.500",
    },
    {
      label: "Shipped Orders",
      value: stats?.shippedOrders,
      help: "On the way",
      color: "cyan.500",
    },
    {
      label: "Delivered Orders",
      value: stats?.deliveredOrders,
      help: "Successfully delivered",
      color: "green.500",
    },
    {
      label: "Cancelled Orders",
      value: stats?.cancelledOrders,
      help: "Cancelled by user",
      color: "red.500",
    },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      help: "Delivered orders only",
      color: "purple.500",
    },
  ];

  if (loading)
    return (
      <Center py={10}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Box mb={10}>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">📊 Database Overview</Heading>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "🔼 Hide" : "🔽 Show"}
        </Button>
      </HStack>

      {show && (
        <SimpleGrid columns={{ base: 2, sm: 3, lg: 5 }} gap={3}>
          {cards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
