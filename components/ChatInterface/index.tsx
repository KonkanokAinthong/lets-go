import { useState, useEffect, useRef } from 'react';
import {
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
import { IconAlertCircle } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage, useIntl } from 'react-intl';

interface ChatInterfaceProps {
  visitedPlaces: any[];
}

const ChatInterface = ({ visitedPlaces }: ChatInterfaceProps) => {
  if (visitedPlaces.length === 0) {
    return 'No visited places found';
  }
  const [messages, setMessages] = useState([]);
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

  const handleGenerateTripPlan = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/trip-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `I want to plan a trip to Thailand with a budget of ${selectedBudget} THB. I will be visiting ${selectedPlace} for ${selectedDuration}.`,
          context: `You are a trip planner assistant helping to plan a trip to Thailand with the following details:
          - Budget: ${selectedBudget} THB
          - Place: ${selectedPlace} 
          - Duration: ${selectedDuration}
          
          If the user's input is in Thai, respond in Thai. If the user's input is in English, respond in English.
          
          Provide your response in bullet points for easy readability, rather than in paragraphs.
          
          Be friendly, helpful, and provide relevant suggestions and information based on the given trip details. Offer recommendations for activities, attractions, accommodations, and transportation options that fit within the specified budget and duration. Take into account the selected place and tailor your recommendations accordingly.
          
          If the user asks about specific attractions, provide brief descriptions and any notable information. If the user asks about transportation options, suggest the most convenient and cost-effective methods based on the trip details.
          
          Remember to keep your responses concise and organized in bullet points. If the user requests more detailed information on a particular topic, you can provide a more in-depth explanation while still maintaining a clear and readable format.
          
          Your goal is to assist the user in planning a memorable and enjoyable trip to Thailand by offering personalized recommendations and helpful information.`,
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
        </Text>
        <Text size="sm" mt="sm">
          <FormattedMessage id="instruction3" />
        </Text>
        <Text size="sm" mt="sm">
          <FormattedMessage id="instruction4" />
        </Text>
      </Modal>
      <Stack>
        <Button variant="outline" onClick={() => setShowInstructions(true)}>
          <FormattedMessage id="showInstructions" />
        </Button>
        <Select
          style={{
            color: 'black',
          }}
          label={<FormattedMessage id="budget" />}
          placeholder={intl.formatMessage({ id: 'selectBudget' })}
          value={selectedBudget}
          onChange={setSelectedBudget}
          data={[
            { value: '1000', label: intl.formatMessage({ id: 'budgetOption1' }) },
            { value: '2000', label: intl.formatMessage({ id: 'budgetOption2' }) },
            { value: '5000', label: intl.formatMessage({ id: 'budgetOption3' }) },
            { value: '10000', label: intl.formatMessage({ id: 'budgetOption4' }) },
          ]}
          required
        />

        <Select
          style={{
            color: 'black',
          }}
          label={<FormattedMessage id="placesVisitedByCelebrity" />}
          placeholder={intl.formatMessage({ id: 'searchPlace' })}
          value={selectedPlace}
          onChange={setSelectedPlace}
          data={visitedPlaces?.map((place) => ({ value: place, label: place }))}
          required
        />

        <Select
          style={{
            color: 'black',
          }}
          label={<FormattedMessage id="duration" />}
          placeholder={intl.formatMessage({ id: 'selectDuration' })}
          value={selectedDuration}
          onChange={setSelectedDuration}
          data={[
            { value: '1-day', label: intl.formatMessage({ id: 'durationOption1' }) },
            { value: '2-days-1-night', label: intl.formatMessage({ id: 'durationOption2' }) },
            { value: '3-days-2-nights', label: intl.formatMessage({ id: 'durationOption3' }) },
            { value: '4-days-3-nights', label: intl.formatMessage({ id: 'durationOption4' }) },
            { value: '5-days-4-nights', label: intl.formatMessage({ id: 'durationOption5' }) },
            { value: '6-days-5-nights', label: intl.formatMessage({ id: 'durationOption6' }) },
            { value: '7-days-6-nights', label: intl.formatMessage({ id: 'durationOption7' }) },
          ]}
          required
        />
        <Button onClick={handleGenerateTripPlan}>
          <FormattedMessage id="generateTripPlan" />
        </Button>
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
        <Button variant="subtle" onClick={handleClearChat} mt="sm">
          <FormattedMessage id="clearChat" />
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
