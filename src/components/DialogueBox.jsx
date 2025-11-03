import { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import './DialogueBox.css';

/**
 * DialogueBox Component
 * Displays conversations with villagers and handles dialogue choices
 */
const DialogueBox = ({ villagerData, onClose }) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);

  const dialogue = useGameStore((state) => state.dialogue);
  const villagers = useGameStore((state) => state.villagers);
  const updateVillagerRelationship = useGameStore((state) => state.updateVillagerRelationship);
  const startQuest = useGameStore((state) => state.startQuest);
  const addNotification = useGameStore((state) => state.addNotification);

  // Get villager info
  const villager = villagers.find(v => v.id === villagerData?.villagerId) || {
    name: villagerData?.villagerName || 'Villager',
    role: 'Villager',
    relationship: 50
  };

  // Simple dialogue tree for demonstration
  const dialogueTree = [
    {
      text: `Greetings, Sifiso! I am ${villager.name}. ${getGreeting()}`,
      choices: [
        { text: 'How are you today?', relationshipChange: 2, nextIndex: 1 },
        { text: 'What can you tell me about the village?', nextIndex: 2 },
        { text: 'Goodbye', nextIndex: -1 }
      ]
    },
    {
      text: 'I am doing well, thank you for asking! Your kindness warms my heart.',
      choices: [
        { text: 'Is there anything I can help you with?', nextIndex: 3 },
        { text: 'Glad to hear it. Take care!', nextIndex: -1 }
      ]
    },
    {
      text: 'Our village has stood here for generations. We live in harmony with the island, but lately there have been some concerns...',
      choices: [
        { text: 'What kind of concerns?', relationshipChange: 3, nextIndex: 4 },
        { text: 'I see. I should get going.', nextIndex: -1 }
      ]
    },
    {
      text: 'Well, I could use some help gathering herbs from the forest. Would you be willing to help me?',
      choices: [
        {
          text: 'Of course! I\'ll gather herbs for you.',
          relationshipChange: 5,
          questTrigger: true,
          nextIndex: 5
        },
        { text: 'Maybe another time.', nextIndex: -1 }
      ]
    },
    {
      text: 'The weather has been strange, and some of our crops are struggling. We worry about our food supplies.',
      choices: [
        { text: 'I\'ll help however I can.', relationshipChange: 5, nextIndex: -1 },
        { text: 'That does sound concerning.', nextIndex: -1 }
      ]
    },
    {
      text: 'Thank you so much, Sifiso! I need 5 bundles of healing herbs. You can find them in the wilderness areas.',
      choices: [
        { text: 'I\'ll get right on it!', nextIndex: -1 }
      ]
    }
  ];

  const currentDialogue = dialogueTree[currentDialogueIndex] || dialogueTree[0];

  // Get contextual greeting based on relationship
  function getGreeting() {
    const rel = villager.relationship || 50;
    if (rel >= 80) return 'It\'s wonderful to see you, my friend!';
    if (rel >= 60) return 'Good to see you!';
    if (rel >= 40) return 'How may I assist you?';
    return 'What brings you here?';
  }

  // Animate text typing effect
  useEffect(() => {
    setDisplayedText('');
    setIsTextComplete(false);
    let currentIndex = 0;
    const text = currentDialogue.text;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTextComplete(true);
        clearInterval(interval);
      }
    }, 30); // Typing speed

    return () => clearInterval(interval);
  }, [currentDialogueIndex, currentDialogue.text]);

  // Handle dialogue choice selection
  const handleChoice = (choice) => {
    // Apply relationship change
    if (choice.relationshipChange && villagerData?.villagerId) {
      updateVillagerRelationship(villagerData.villagerId, choice.relationshipChange);

      if (choice.relationshipChange > 0) {
        addNotification(`Relationship with ${villager.name} improved!`, 'success');
      }
    }

    // Trigger quest if applicable
    if (choice.questTrigger) {
      const quest = {
        id: `herb_gathering_${villager.id}`,
        title: 'Gather Healing Herbs',
        description: `Collect 5 bundles of healing herbs for ${villager.name}.`,
        type: 'side',
        giver: villager.name,
        objectives: [
          {
            description: 'Collect healing herbs',
            current: 0,
            target: 5
          }
        ],
        rewards: {
          knowledgePoints: 10,
          influence: 5,
          items: []
        }
      };
      startQuest(quest);
    }

    // Navigate to next dialogue or close
    if (choice.nextIndex === -1) {
      onClose();
    } else {
      setCurrentDialogueIndex(choice.nextIndex);
    }
  };

  // Get relationship status text
  const getRelationshipStatus = () => {
    const rel = villager.relationship || 50;
    if (rel >= 80) return { text: 'Close Friend', color: '#4caf50' };
    if (rel >= 60) return { text: 'Friend', color: '#8bc34a' };
    if (rel >= 40) return { text: 'Acquaintance', color: '#ffc107' };
    if (rel >= 20) return { text: 'Stranger', color: '#ff9800' };
    return { text: 'Unfamiliar', color: '#f44336' };
  };

  const relationshipStatus = getRelationshipStatus();

  return (
    <div className="dialogue-overlay">
      <div className="dialogue-box">
        {/* Villager Info */}
        <div className="dialogue-header">
          <div className="villager-portrait">
            <div className="portrait-placeholder">
              {villager.name?.[0] || 'V'}
            </div>
          </div>
          <div className="villager-info">
            <h2>{villager.name}</h2>
            <p className="villager-role">{villager.role}</p>
            <div className="relationship-bar">
              <div
                className="relationship-fill"
                style={{
                  width: `${villager.relationship || 50}%`,
                  backgroundColor: relationshipStatus.color
                }}
              />
            </div>
            <p className="relationship-status" style={{ color: relationshipStatus.color }}>
              {relationshipStatus.text}
            </p>
          </div>
          <button className="dialogue-close" onClick={onClose}>×</button>
        </div>

        {/* Dialogue Text */}
        <div className="dialogue-content">
          <p className="dialogue-text">
            {displayedText}
            {!isTextComplete && <span className="cursor-blink">|</span>}
          </p>
        </div>

        {/* Dialogue Choices */}
        {isTextComplete && (
          <div className="dialogue-choices">
            {currentDialogue.choices.map((choice, index) => (
              <button
                key={index}
                className="dialogue-choice"
                onClick={() => handleChoice(choice)}
              >
                <span className="choice-number">{index + 1}</span>
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* Skip text hint */}
        {!isTextComplete && (
          <div className="dialogue-hint">
            <small>Press Space to skip...</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;
