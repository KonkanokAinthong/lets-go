import { useState, useEffect, useRef } from 'react';
import { TextInput, Paper, Text, Box, Title, Avatar, Select, Stack } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [budget, setBudget] = useState('');
  const chatContainerRef = useRef(null);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

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
            context: `You are a trip planner assistant helping to plan a trip to Thailand with a budget of ${budget} THB. If the user's input is in Thai, respond in Thai. If the user's input is in English, respond in English. Provide your response in bullet points for easy readability, rather than in paragraphs.`,
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
      <Stack>
        <Select
          label="Budget (THB)"
          placeholder="Select budget"
          value={selectedBudget}
          onChange={setSelectedBudget}
          data={[
            { value: '1000', label: '1,000 THB' },
            { value: '2000', label: '2,000 THB' },
            { value: '5000', label: '5,000 THB' },
            { value: '10000', label: '10,000 THB' },
          ]}
        />

        <Select
          label="Province"
          placeholder="Select province"
          value={selectedProvince}
          onChange={setSelectedProvince}
          data={[
            { value: 'bangkok', label: 'Bangkok' },
            { value: 'amnatCharoen', label: 'Amnat Charoen' },
            { value: 'angThong', label: 'Ang Thong' },
            { value: 'buengKan', label: 'Bueng Kan' },
            { value: 'buriram', label: 'Buriram' },
            { value: 'chachoengsao', label: 'Chachoengsao' },
            { value: 'chainat', label: 'Chainat' },
            { value: 'chaiyaphum', label: 'Chaiyaphum' },
            { value: 'chanthaburi', label: 'Chanthaburi' },
            { value: 'chiangMai', label: 'Chiang Mai' },
            { value: 'chiangRai', label: 'Chiang Rai' },
            { value: 'chonburi', label: 'Chonburi' },
            { value: 'chumphon', label: 'Chumphon' },
            { value: 'kalasin', label: 'Kalasin' },
            { value: 'kamphaengPhet', label: 'Kamphaeng Phet' },
            { value: 'kanchanaburi', label: 'Kanchanaburi' },
            { value: 'khonKaen', label: 'Khon Kaen' },
            { value: 'krabi', label: 'Krabi' },
            { value: 'lampang', label: 'Lampang' },
            { value: 'lamphun', label: 'Lamphun' },
            { value: 'loei', label: 'Loei' },
            { value: 'lopburi', label: 'Lopburi' },
            { value: 'mae Hong Son', label: 'Mae Hong Son' },
            { value: 'maha Sarakham', label: 'Maha Sarakham' },
            { value: 'mukdahan', label: 'Mukdahan' },
            { value: 'nakhonNayok', label: 'Nakhon Nayok' },
            { value: 'nakhonPathom', label: 'Nakhon Pathom' },
            { value: 'nakhonPhanom', label: 'Nakhon Phanom' },
            { value: 'nakhonRatchasima', label: 'Nakhon Ratchasima' },
            { value: 'nakhonSawan', label: 'Nakhon Sawan' },
            { value: 'nakhonSiThammarat', label: 'Nakhon Si Thammarat' },
            { value: 'nan', label: 'Nan' },
            { value: 'narathiwat', label: 'Narathiwat' },
            { value: 'nongBuaLamphu', label: 'Nong Bua Lamphu' },
            { value: 'nongKhai', label: 'Nong Khai' },
            { value: 'nonthaburi', label: 'Nonthaburi' },
            { value: 'pathumThani', label: 'Pathum Thani' },
            { value: 'pattani', label: 'Pattani' },
            { value: 'phangNga', label: 'Phang Nga' },
            { value: 'phatthalung', label: 'Phatthalung' },
            { value: 'phayao', label: 'Phayao' },
            { value: 'phetchabun', label: 'Phetchabun' },
            { value: 'phetchaburi', label: 'Phetchaburi' },
            { value: 'phichit', label: 'Phichit' },
            { value: 'phitsanulok', label: 'Phitsanulok' },
            { value: 'phra Nakhon Si Ayutthaya', label: 'Phra Nakhon Si Ayutthaya' },
            { value: 'phrae', label: 'Phrae' },
            { value: 'phuket', label: 'Phuket' },
            { value: 'prachinBuri', label: 'Prachin Buri' },
            { value: 'prachuapKhiriKhan', label: 'Prachuap Khiri Khan' },
            { value: 'ranong', label: 'Ranong' },
            { value: 'ratchaburi', label: 'Ratchaburi' },
            { value: 'rayong', label: 'Rayong' },
            { value: 'roiEt', label: 'Roi Et' },
            { value: 'saKaeo', label: 'Sa Kaeo' },
            { value: 'sakonNakhon', label: 'Sakon Nakhon' },
            { value: 'samutPrakan', label: 'Samut Prakan' },
            { value: 'samutSakhon', label: 'Samut Sakhon' },
            { value: 'samutSongkhram', label: 'Samut Songkhram' },
            { value: 'saraburi', label: 'Saraburi' },
            { value: 'satun', label: 'Satun' },
            { value: 'singBuri', label: 'Sing Buri' },
            { value: 'siSaKet', label: 'Si Sa Ket' },
            { value: 'songkhla', label: 'Songkhla' },
            { value: 'sukhothai', label: 'Sukhothai' },
            { value: 'suphanburi', label: 'Suphanburi' },
            { value: 'suratThani', label: 'Surat Thani' },
            { value: 'surin', label: 'Surin' },
            { value: 'tak', label: 'Tak' },
            { value: 'trang', label: 'Trang' },
            { value: 'trat', label: 'Trat' },
            { value: 'ubonRatchathani', label: 'Ubon Ratchathani' },
            { value: 'udonThani', label: 'Udon Thani' },
            { value: 'uthaithani', label: 'Uthai Thani' },
            { value: 'uttaradit', label: 'Uttaradit' },
            { value: 'yala', label: 'Yala' },
            { value: 'yasothon', label: 'Yasothon' },
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
