// ChatWindow.jsx
import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import RecyclingIcon from "@mui/icons-material/Recycling";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import PropTypes from "prop-types";
import Message from "../Message/Message";
import styles from "./ChatWindow.module.css";

function ChatWindow({
  messages,
  isLoading,
  handleSubmit,
  selectedAssistant,
  assistantName,
  handleSwitchAssistant,
  threadsReady,
  threadsError,
  retryInitThreads,
}) {
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const prompts = [
    {
      icon: <LightbulbIcon fontSize="medium" />,
      title: "Brainstorm",
      description: "Get creative ideas for reducing carbon emissions.",
      prompt:
        "Brainstorm creative ideas for reducing carbon emissions at home.",
    },
    {
      icon: <RecyclingIcon fontSize="medium" />,
      title: "Recycling Tips",
      description: "Learn how to recycle effectively.",
      prompt: "Provide tips on how to recycle effectively at home.",
    },
    {
      icon: <EnergySavingsLeafIcon fontSize="medium" />,
      title: "Sustainability",
      description: "Explore ways to live more sustainably.",
      prompt: "Suggest ways to live a more sustainable lifestyle.",
    },
    {
      icon: <WaterDropIcon fontSize="medium" />,
      title: "Water Conservation",
      description: "Find out how to conserve water.",
      prompt: "Give advice on how to conserve water at home.",
    },
  ];

  const handleSend = (message = "") => {
    const input = message || userInput;
    if (input.trim()) {
      handleSubmit(input);
      setUserInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = async (prompt) => {
    setIsProcessing(true);

    let newAssistantId = selectedAssistant;
    if (prompt.title.includes("Recycling"))
      newAssistantId = import.meta.env.VITE_RECYCLING;
    else if (prompt.title.includes("Sustainability"))
      newAssistantId = import.meta.env.VITE_ELECTRICITY;
    else if (prompt.title.includes("Water"))
      newAssistantId = import.meta.env.VITE_WATER;
    else newAssistantId = import.meta.env.VITE_CARBON;

    if (newAssistantId !== selectedAssistant) {
      await handleSwitchAssistant(newAssistantId);
      setIsProcessing(false);
    }

    await handleSend(prompt.prompt);
    setIsProcessing(false);
  };

  return (
    <Box className={styles.chatWindow}>
      <div className={styles.assistantTitle}>{assistantName}</div>

      {threadsError && (
        <div
          className={styles.typingIndicator}
          style={{
            flexDirection: "column",
            alignItems: "center",
            color: "#ff5252",
          }}
        >
          <span
            style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: 8 }}
          >
            Failed to initialize assistants
          </span>
          <span style={{ marginBottom: 16 }}>
            Please check your network connection or API key, then try again.
          </span>
          <button
            onClick={retryInitThreads}
            style={{
              background: "#9c27b0",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(156,39,176,0.15)",
              marginTop: 8,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!threadsReady && !threadsError && (
        <div className={styles.typingIndicator}>
          <div className={styles.dotFlashing}></div>
          <span>Initializing assistants...</span>
        </div>
      )}

      {messages.length === 0 && !isLoading && threadsReady && !threadsError && (
        <div className={styles.promptStarters}>
          <div className={styles.promptGrid}>
            {prompts.map((prompt, index) => (
              <div
                key={index}
                className={styles.promptCard}
                onClick={() =>
                  !isProcessing &&
                  threadsReady &&
                  !threadsError &&
                  handlePromptClick(prompt)
                }
                style={{
                  pointerEvents:
                    !threadsReady || isProcessing || threadsError
                      ? "none"
                      : "auto",
                  opacity:
                    !threadsReady || isProcessing || threadsError ? 0.7 : 1,
                }}
              >
                <div className={styles.promptIcon}>{prompt.icon}</div>
                <div className={styles.promptContent}>
                  <h3>{prompt.title}</h3>
                  <p>{prompt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Box className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
        {isLoading && (
          <div className={styles.typingIndicator}>
            <div className={styles.dotFlashing}></div>
            <span>SymbioAI is typing</span>
          </div>
        )}
      </Box>

      <div className={styles.inputContainer}>
        <TextField
          fullWidth
          multiline
          rows={1}
          placeholder="Type your message here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.textField}
          InputProps={{
            style: { color: "#fff", borderRadius: "16px" },
            sx: {
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            },
          }}
          disabled={!threadsReady || threadsError}
        />
        <IconButton
          onClick={() => handleSend()}
          disabled={isLoading || isProcessing || !threadsReady || threadsError}
          className={styles.sendButton}
          sx={{
            color: "#fff",
            bgcolor: "#9c27b0",
            "&:hover": { bgcolor: "#7b1fa2" },
            borderRadius: "50%",
            padding: "14px",
          }}
        >
          <ArrowUpwardIcon fontSize="medium" />
        </IconButton>
      </div>
    </Box>
  );
}

ChatWindow.propTypes = {
  messages: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  selectedAssistant: PropTypes.string.isRequired,
  setSelectedAssistant: PropTypes.func.isRequired,
  assistantName: PropTypes.string.isRequired,
  handleSwitchAssistant: PropTypes.func.isRequired,
  threadsReady: PropTypes.bool.isRequired,
  threadsError: PropTypes.bool.isRequired,
  retryInitThreads: PropTypes.func.isRequired,
};

export default ChatWindow;
