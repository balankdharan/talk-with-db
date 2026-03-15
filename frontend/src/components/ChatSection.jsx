import { useState, useRef, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export default function ChatSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me anything about your database." },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ask = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: userQuestion }]);
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/chat`, {
        question: userQuestion,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.data.answer,
          rowCount: res.data.rowCount,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <Box bg="white" borderRadius="xl" shadow="sm" p={6}>
      <Heading size="md" mb={4}>
        💬 Ask Your Database
      </Heading>

      {/* Messages */}
      <VStack
        spacing={3}
        align="stretch"
        h="400px"
        overflowY="auto"
        mb={4}
        pr={2}
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
            bg={msg.role === "user" ? "blue.500" : "gray.100"}
            color={msg.role === "user" ? "white" : "gray.800"}
            px={4}
            py={3}
            borderRadius="xl"
            maxW="75%"
          >
            <Text fontSize="sm">{msg.text}</Text>
            {msg.rowCount !== undefined && (
              <Badge mt={1} colorScheme="gray" fontSize="xs">
                {msg.rowCount} result{msg.rowCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </Box>
        ))}
        {loading && (
          <Box
            alignSelf="flex-start"
            bg="gray.100"
            px={4}
            py={3}
            borderRadius="xl"
          >
            <Spinner size="sm" />
          </Box>
        )}
        <div ref={bottomRef} />
      </VStack>

      {/* Input */}
      <HStack>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="e.g. how many users signed up this month?"
          borderRadius="xl"
        />
        <Button
          colorScheme="blue"
          onClick={ask}
          isLoading={loading}
          borderRadius="xl"
          px={6}
        >
          Ask
        </Button>
      </HStack>
    </Box>
  );
}
