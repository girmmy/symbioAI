//App.jsx
import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import { getAssistantResponse } from './api/openai';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const assistants = [
  { id: 'asst_j2lg6re3njFZSCsMIQkI8mO4', name: 'Carbon Assistant', color: '#9c27b0' },
  { id: 'asst_eLkixunEVtdNYTSCDte4WrNh', name: 'Recycling Assistant', color: '#673ab7' },
  { id: 'asst_ki6R6jlbnBapIRD5YXIdn5DU', name: 'Electricity Assistant', color: '#3f51b5' },
  { id: 'asst_qcgWbKQKWybb0wmetTq8uuat', name: 'Water Conservation Assistant', color: '#2196f3' },
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
  const [selectedAssistant, setSelectedAssistant] = useState('asst_j2lg6re3njFZSCsMIQkI8mO4');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSubmit = async (userInput, assistantId = selectedAssistant) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
  
    try {
      const assistantResponse = await getAssistantResponse(assistantId, userInput);
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I could not process your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]); // Clear chat messages
    setSelectedAssistant('asst_j2lg6re3njFZSCsMIQkI8mO4'); // resets to default assist.
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
        {/* this toggles the sidebar button */}
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