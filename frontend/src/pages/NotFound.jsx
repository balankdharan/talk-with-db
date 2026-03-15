import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4} textAlign="center">
        <Heading size="4xl" color="gray.200">
          404
        </Heading>
        <Heading size="lg">Page Not Found</Heading>
        <Text color="gray.500">The page you're looking for doesn't exist.</Text>
        <Button colorScheme="blue" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </VStack>
    </Box>
  );
}
