import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import StatsSection from "../components/StatsSection";
import ChatSection from "../components/ChatSection";

export default function Home() {
  return (
    <Box minH="100vh" bg="gray.50" py={10} px={{ base: 4, md: 10 }}>
      <VStack spacing={2} mb={10} textAlign="center">
        <Heading size="xl">Chat With Your Database</Heading>
        <Text color="gray.500">
          Ask anything about your data in plain English
        </Text>
      </VStack>

      {/* Section 1 - Stats */}
      <StatsSection />

      {/* Note */}
      <Box
        bg="blue.50"
        border="1px solid"
        borderColor="blue.200"
        borderRadius="lg"
        p={4}
        mb={6}
      >
        <Text fontSize="sm" color="blue.700" fontWeight="600" mb={1}>
          📌 How this works
        </Text>
        <Text fontSize="sm" color="blue.600">
          The <strong>Database Overview</strong> above is fetched directly from
          the API — no AI involved. Use it to verify if the AI is giving you
          correct answers.
        </Text>
        <Text fontSize="sm" color="blue.600" mt={1}>
          The <strong>Chat below</strong> is powered by Groq AI. It does not use
          the fetched data above — instead it analyzes your MongoDB schema and
          queries the database directly based on your question.
        </Text>
      </Box>

      {/* Section 2 - Chat */}
      <ChatSection />
    </Box>
  );
}
