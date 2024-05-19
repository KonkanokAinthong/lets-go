import { useState, useEffect, useRef } from 'react';
import {
  TextInput,
  Paper,
  Text,
  Box,
  Title,
  Avatar,
  Select,
  Stack,
  Modal,
  Button,
} from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  visitedPlaces: any[];
}

const ChatInterface = ({ visitedPlaces }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef(null);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('');

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');

      try {
        const response = await fetch('/api/trip-planner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputValue,
            context: `You are a trip planner assistant helping to plan a trip to Thailand with the following details:
              - Budget: ${selectedBudget} THB
              - Province: ${selectedProvince}
              - Duration: ${selectedDuration}
              If the user's input is in Thai, respond in Thai. If the user's input is in English, respond in English. Provide your response in bullet points for easy readability, rather than in paragraphs.`,
          }),
        });

        const data = await response.json();
        if (data.response) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.response, sender: 'assistant' },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.error, sender: 'assistant' },
          ]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'An error occurred. Please try again later.',
            sender: 'assistant',
          },
        ]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper shadow="sm" p="md" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Title order={3} mb="md">
        Thailand Trip Planner
      </Title>
      <Modal
        opened={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="How to Use"
        centered
      >
        <Text size="sm">
          1. Select your budget, desired province, and duration for the trip using the dropdown
          menus.
        </Text>
        <Text size="sm" mt="sm">
          2. Type your message or query related to trip planning in the input field at the bottom.
        </Text>
        <Text size="sm" mt="sm">
          3. Press Enter or click the send icon to submit your message.
        </Text>
        <Text size="sm" mt="sm">
          4. The assistant will provide a response with trip suggestions based on your inputs.
        </Text>
        <Text size="sm" mt="sm">
          5. You can continue the conversation by typing additional messages or modifying your
          selections.
        </Text>
      </Modal>
      <Stack>
        <Button variant="outline" onClick={() => setShowInstructions(true)}>
          Show Instructions
        </Button>
        <Select
          label="Budget (THB)"
          placeholder="เลือกงบประมาณ"
          value={selectedBudget}
          onChange={setSelectedBudget}
          data={[
            { value: '1000', label: '1,000 บาท' },
            { value: '2000', label: '2,000 บาท' },
            { value: '5000', label: '5,000 บาท' },
            { value: '10000', label: '10,000 บาท' },
          ]}
        />

        <Select
          label="Places Visited by Celebrity"
          placeholder="Select a place"
          value={selectedPlace}
          onChange={setSelectedPlace}
          data={visitedPlaces.map((place) => ({ value: place, label: place }))}
        />

        <Select
          label="Duration"
          placeholder="เลือกระยะเวลาการท่องเที่ยว"
          value={selectedDuration}
          onChange={setSelectedDuration}
          data={[
            { value: '1-day', label: '1 วัน' },
            { value: '2-days-1-night', label: '2 วัน 1 คืน' },
            { value: '3-days-2-nights', label: '3 วัน 2 คืน' },
            { value: '4-days-3-nights', label: '4 วัน 3 คืน' },
            { value: '5-days-4-nights', label: '5 วัน 4 คืน' },
            { value: '6-days-5-nights', label: '6 วัน 5 คืน' },
            { value: '7-days-6-nights', label: '7 วัน 6 คืน' },
          ]}
        />
      </Stack>
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '16px',
        }}
        ref={chatContainerRef}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {message.sender === 'assistant' && (
              <Avatar src="/path/to/assistant/avatar.png" alt="Assistant Avatar" mr="sm" />
            )}
            <Paper
              p="sm"
              style={{
                backgroundColor: message.sender === 'user' ? '#2196f3' : '#f1f3f5',
                color: message.sender === 'user' ? 'white' : 'black',
                borderRadius: '16px',
                maxWidth: '70%',
              }}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </Paper>
          </Box>
        ))}
      </Box>

      <Box style={{ position: 'relative', bottom: 0, left: 0, right: 0 }}>
        <TextInput
          placeholder="พิมข้อความวางแผนการเดินทางของคุณที่นี่.."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          rightSection={<IconSend onClick={handleSendMessage} />}
        />
      </Box>
    </Paper>
  );
};

export default ChatInterface;
