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
  LoadingOverlay,
  Alert,
} from '@mantine/core';
import { IconSend, IconAlertCircle } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage, useIntl } from 'react-intl';

interface ChatInterfaceProps {
  visitedPlaces: any[];
}

const ChatInterface = ({ visitedPlaces }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef(null);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const intl = useIntl();

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
      setIsLoading(true);
      setError('');

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
              - Place: ${selectedPlace}
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
          setError(intl.formatMessage({ id: 'errorMessage' }));
        }
      } catch (error) {
        console.error('Error:', error);
        setError(intl.formatMessage({ id: 'errorMessage' }));
      }

      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <Paper shadow="sm" p="md" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LoadingOverlay visible={isLoading} />
      <Title order={3} mb="md">
        <FormattedMessage id="thailandTripPlanner" />
      </Title>
      <Modal
        opened={showInstructions}
        onClose={() => setShowInstructions(false)}
        title={<FormattedMessage id="howToUse" />}
        centered
      >
        <Text size="sm">
          <FormattedMessage id="instruction1" />
        </Text>
        <Text size="sm" mt="sm">
          <FormattedMessage id="instruction2" />
          <ul style={{ marginTop: '8px', marginLeft: '16px', listStyle: 'none' }}>
            <li>
              <FormattedMessage id="exampleQuery1" />
            </li>
            <li>
              <FormattedMessage id="exampleQuery2" />
            </li>
            <li>
              <FormattedMessage id="exampleQuery3" />
            </li>
          </ul>
        </Text>
        <Text size="sm" mt="sm">
          <FormattedMessage id="instruction3" />
        </Text>
        <Text size="sm" mt="sm">
          <FormattedMessage id="instruction4" />
        </Text>
        <Text size="sm" mt="sm">
          <FormattedMessage id="instruction5" />
        </Text>
      </Modal>
      <Stack
        c="black
      "
      >
        <Button variant="outline" onClick={() => setShowInstructions(true)}>
          <FormattedMessage id="showInstructions" />
        </Button>
        <Select
          label={<FormattedMessage id="budget" />}
          placeholder="Select budget"
          value={selectedBudget}
          onChange={setSelectedBudget}
          data={[
            { value: '1000', label: '1,000 THB' },
            { value: '2000', label: '2,000 THB' },
            { value: '5000', label: '5,000 THB' },
            { value: '10000', label: '10,000 THB' },
          ]}
          required
        />

        <Select
          label={<FormattedMessage id="placesVisitedByCelebrity" />}
          placeholder="Search place"
          value={selectedPlace}
          onChange={setSelectedPlace}
          data={visitedPlaces?.map((place) => ({ value: place, label: place }))}
          required
        />

        <Select
          label={<FormattedMessage id="duration" />}
          placeholder="Select duration"
          value={selectedDuration}
          onChange={setSelectedDuration}
          data={[
            { value: '1-day', label: '1 day' },
            { value: '2-days-1-night', label: '2 days 1 night' },
            { value: '3-days-2-nights', label: '3 days 2 nights' },
            { value: '4-days-3-nights', label: '4 days 3 nights' },
            { value: '5-days-4-nights', label: '5 days 4 nights' },
            { value: '6-days-5-nights', label: '6 days 5 nights' },
            { value: '7-days-6-nights', label: '7 days 6 nights' },
          ]}
          required
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

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title={<FormattedMessage id="error" />}
          color="red"
          mb="sm"
        >
          {error}
        </Alert>
      )}

      <Box style={{ position: 'relative', bottom: 0, left: 0, right: 0 }}>
        <TextInput
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          rightSection={<IconSend onClick={handleSendMessage} />}
        />
        <Button variant="subtle" onClick={handleClearChat} mt="sm">
          <FormattedMessage id="clearChat" />
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
