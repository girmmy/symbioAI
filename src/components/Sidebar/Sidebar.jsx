// Sidebar.jsx
import { List, ListItem, ListItemButton, ListItemText, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import PropTypes from 'prop-types';
import styles from './Sidebar.module.css';
import logo from '.././../assets/symbioai-logo.png';


const assistants = [
  { id: 'asst_j2lg6re3njFZSCsMIQkI8mO4', name: 'Carbon Assistant', color: '#9c27b0' },
  { id: 'asst_eLkixunEVtdNYTSCDte4WrNh', name: 'Recycling Assistant', color: '#673ab7' },
  { id: 'asst_ki6R6jlbnBapIRD5YXIdn5DU', name: 'Electricity Assistant', color: '#3f51b5' },
  { id: 'asst_qcgWbKQKWybb0wmetTq8uuat', name: 'Water Conservation Assistant', color: '#2196f3' },
];

function Sidebar({ selectedAssistant, setSelectedAssistant, isSidebarOpen, toggleSidebar, onNewChat }) {
  return (
    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
      {/* Sidebar Header with Toggle Button */}
      <Box className={styles.sidebarHeader}>
        <IconButton onClick={toggleSidebar} className={styles.menuButton} sx={{ fontSize: '1.5rem', marginRight: '1.5rem' }}></IconButton>
        <a href="./" alt="SymbioAI Logo"><img src={logo} alt="SymbioAI Logo" className={styles.logo} /></a>
      </Box>

      {/* New Chat Button */}
      <button className={styles.newChatButton} onClick={onNewChat}>
        <AddIcon className={styles.newChatIcon} />
        <span>New Chat</span>
      </button>

      {/* Assistant Buttons */}
      <List className={styles.assistantList}>
        {assistants.map((assistant) => (
          <ListItem key={assistant.id} disablePadding>
            <ListItemButton
              selected={selectedAssistant === assistant.id}
              onClick={() => setSelectedAssistant(assistant.id)}
              className={`${styles.assistantButton} ${
                selectedAssistant === assistant.id ? styles.selected : ''
              }`}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '1rem',
                color: selectedAssistant === assistant.id ? '#fff' : assistant.color,
                bgcolor: selectedAssistant === assistant.id ? assistant.color : 'transparent',
                '&:hover': {
                  bgcolor: assistant.color,
                  color: '#fff',
                },
              }}
            >
              <ListItemText
                primary={assistant.name}
                className={styles.assistantText}
                sx={{fontFamily: 'Poppins, sans-serif !important'}}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

// Prop validation
Sidebar.propTypes = {
  selectedAssistant: PropTypes.string.isRequired,
  setSelectedAssistant: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  onNewChat: PropTypes.func.isRequired,
};

export default Sidebar;