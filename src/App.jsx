// App.jsx
import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  createThread,
  sendMessage,
  runAssistant,
  cancelRun,
} from "./api/openai.js";

const carbon_asst = import.meta.env.VITE_CARBON;
const recycling_asst = import.meta.env.VITE_RECYCLING;
const electricity_asst = import.meta.env.VITE_ELECTRICITY;
const water_asst = import.meta.env.VITE_WATER;

const assistants = [
  { id: carbon_asst, name: "Carbon Assistant", color: "#9c27b0" },
  { id: recycling_asst, name: "Recycling Assistant", color: "#673ab7" },
  { id: electricity_asst, name: "Electricity Assistant", color: "#3f51b5" },
  { id: water_asst, name: "Water Conservation Assistant", color: "#2196f3" },
];

const theme = createTheme({
  typography: { fontFamily: "Poppins, sans-serif" },
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: { fontFamily: "Poppins, sans-serif" },
      },
    },
  },
});

function App() {
  const [selectedAssistant, setSelectedAssistant] = useState(carbon_asst);
  const [threadMap, setThreadMap] = useState({});
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentRunId, setCurrentRunId] = useState(null);

  useEffect(() => {
    // Create a thread for each assistant when the app starts
    const initThreads = async () => {
      const map = {};
      for (const assistant of assistants) {
        map[assistant.id] = await createThread();
      }
      setThreadMap(map);
    };
    initThreads();
  }, []);

  const handleSubmit = async (userInput) => {
    setIsLoading(true);
    const threadId = threadMap[selectedAssistant];
    const runMeta = { cancelled: false };
    window.currentRunMeta = runMeta;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    try {
      await sendMessage(threadId, userInput);

      const { runId, result } = await runAssistant(threadId, selectedAssistant);
      setCurrentRunId(runId);

      const finalMessage = await result;

      // Don't add stale response
      if (runMeta.cancelled) return;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: finalMessage },
      ]);
    } catch (error) {
      if (!runMeta.cancelled) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't process your request.",
          },
        ]);
      }
      console.error("Error running assistant:", error);
    } finally {
      // ✅ Ensure loading stops
      if (!runMeta.cancelled) {
        setIsLoading(false);
      }
      setCurrentRunId(null);
    }
  };

  const handleSwitchAssistant = async (newAssistantId) => {
    // Cancel active run if any
    if (currentRunId && threadMap[selectedAssistant]) {
      const threadId = threadMap[selectedAssistant];
      await cancelRun(threadId, currentRunId);
      if (window.currentRunMeta) window.currentRunMeta.cancelled = true;
    }

    // Reset UI state
    setSelectedAssistant(newAssistantId);
    setMessages([]);
    setIsLoading(false); // ✅ hide typing indicator
    setCurrentRunId(null);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedAssistant(carbon_asst);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentAssistant = assistants.find(
    (assistant) => assistant.id === selectedAssistant
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          bgcolor: "#121212",
          minHeight: "100vh",
          color: "#fff",
        }}
      >
        <Sidebar
          selectedAssistant={selectedAssistant}
          setSelectedAssistant={handleSwitchAssistant}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onNewChat={handleNewChat}
        />

        <Box sx={{ flexGrow: 1 }}>
          <IconButton
            onClick={toggleSidebar}
            sx={{
              color: "#fff",
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 1200,
            }}
          >
            <MenuIcon />
          </IconButton>

          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            assistantName={currentAssistant.name}
            selectedAssistant={selectedAssistant}
            setSelectedAssistant={setSelectedAssistant}
            handleSwitchAssistant={handleSwitchAssistant}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
