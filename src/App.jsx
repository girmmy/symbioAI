import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const API_KEY = import.meta.env.VITE_API_KEY;
const carbon_asst = import.meta.env.VITE_CARBON;
const recycling_asst = import.meta.env.VITE_RECYCLING;
const electricity_asst = import.meta.env.VITE_ELECTRICITY;
const water_asst = import.meta.env.VITE_WATER;

const assistants = [
  { id: carbon_asst, name: 'Carbon Assistant', color: '#9c27b0' },
  { id: recycling_asst, name: 'Recycling Assistant', color: '#673ab7' },
  { id: electricity_asst, name: 'Electricity Assistant', color: '#3f51b5' },
  { id: water_asst, name: 'Water Conservation Assistant', color: '#2196f3' },
];

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
  },
});


function App() {
  const [selectedAssistant, setSelectedAssistant] = useState(carbon_asst);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSubmit = async (userInput, assistantId = selectedAssistant) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Use a valid model
          messages: [
            { role: 'system', content: `You are an assistant focused on ${assistantId}. Provide advice to homeowners and consumers. Be clear in the information you give the user but be brief. If someone asks for something simple you don't need to give them paragraphs of explanations.` },
            { role: 'user', content: userInput },
          ],
        }),
      });

      await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 1-second delay

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I could not process your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]); // Clear chat messages
    setSelectedAssistant(carbon_asst); // Reset to default assistant
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get the current assistant's name
  const currentAssistant = assistants.find((assistant) => assistant.id === selectedAssistant);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', bgcolor: '#121212', minHeight: '100vh', color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
        {/* Sidebar */}
        <Sidebar
          selectedAssistant={selectedAssistant}
          setSelectedAssistant={setSelectedAssistant}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onNewChat={handleNewChat}
        />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Toggle Sidebar Button */}
          <IconButton
            onClick={toggleSidebar}
            sx={{ color: '#fff', position: 'fixed', top: 16, left: 16, zIndex: 1200 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Chat Window */}
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            assistantName={currentAssistant.name}
            selectedAssistant={selectedAssistant}
            setSelectedAssistant={setSelectedAssistant}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;