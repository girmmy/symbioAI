// Message.jsx
import { Box, Paper } from "@mui/material";
import PropTypes from "prop-types";
import styles from "./Message.module.css";

export default function Message({ role, content }) {
  if (!content) return null; // Prevents a crash if content is missing

  const isUser = role === "user";
  const align = isUser ? styles.userMessage : styles.assistantMessage;
  const bgcolor = isUser ? "#9c27b0" : "#673ab7";

  // Format content with paragraphs and bold text
  const formattedContent = content.split("\n").map((paragraph, pIndex) => (
    <div key={pIndex} className={styles.paragraph}>
      {paragraph.split("**").map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className={styles.boldText}>
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </div>
  ));

  return (
    <Box className={`${styles.messageContainer} ${align}`}>
      <Paper
        sx={{
          p: 2,
          bgcolor,
          color: "#fff",
          maxWidth: { xs: "90%", sm: "70%" },
          borderRadius: "16px",
        }}
      >
        <Box sx={{ fontFamily: "Poppins, sans-serif", whiteSpace: "pre-wrap" }}>
          {formattedContent}
        </Box>
      </Paper>
    </Box>
  );
}

Message.propTypes = {
  role: PropTypes.string.isRequired,
  content: PropTypes.string, // not required anymore
};
