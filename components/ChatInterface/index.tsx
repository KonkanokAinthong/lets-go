import { useState, useEffect, useRef } from 'react';
import { TextInput, Button, Paper, Text, Space, Box, Title, Avatar, Select } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [budget, setBudget] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

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
            context: `You are a trip planner assistant helping to plan a trip to Thailand with a budget of ${budget} THB.`,
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
          { text: 'An error occurred. Please try again later.', sender: 'assistant' },
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
      <Select
        label="Budget (THB)"
        placeholder="Select budget"
        value={budget}
        onChange={setBudget}
        data={[
          { value: '10000', label: '10,000 THB' },
          { value: '20000', label: '20,000 THB' },
          { value: '30000', label: '30,000 THB' },
          { value: '40000', label: '40,000 THB' },
          { value: '50000', label: '50,000 THB' },
        ]}
        mb="md"
      />
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
              <Text>{message.text}</Text>
            </Paper>
          </Box>
        ))}
      </Box>
      <Box style={{ position: 'relative', bottom: 0, left: 0, right: 0 }}>
        <TextInput
          placeholder="Type your message..."
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
