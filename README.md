# Sifiso: The Heart of the Island

A web-based 2D adventure-strategy game where you control Sifiso, a wise savior protecting an island community through intelligence, courage, and compassion.

![Game Title](https://via.placeholder.com/800x200/2d4a3e/ffd700?text=Sifiso:+The+Heart+of+the+Island)

## 🎮 Game Overview

**Sifiso: The Heart of the Island** combines exploration, dialogue, resource management, and crisis response mechanics. Navigate crises, build relationships with villagers, gather resources, and make critical decisions that affect the entire island community.

### Key Features

- **Explorable Village World** - Navigate a vibrant 2D village with multiple locations
- **Dynamic Villager Relationships** - Build relationships with 5 unique villagers, each with their own personality and story
- **Resource Management** - Gather food, materials, and medicinal supplies
- **Quest System** - Complete main story quests and side quests
- **Crisis Response** - Handle emergencies that threaten the village
- **Time System** - Day/night cycle with time-based events
- **Inventory System** - Collect and manage items with different categories
- **Village Metrics** - Monitor and improve village happiness, health, food supply, and security

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

### Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🎯 How to Play

### Game Controls

| Key | Action |
|-----|--------|
| `WASD` or `Arrow Keys` | Move Sifiso around the village |
| `E` | Interact with villagers, buildings, and resources |
| `I` | Open/close inventory |
| `Esc` | Close menus and dialogues |
| `1-9` | Select dialogue choices (when in conversation) |

### Gameplay Loop

1. **Explore the Village** - Move around to discover different areas and villagers
2. **Interact with Villagers** - Press `E` near a villager to start a conversation
3. **Gather Resources** - Find resource nodes around the village and wilderness
4. **Manage Your Stats** - Keep an eye on your health, stamina, and influence
5. **Complete Quests** - Accept and complete quests to gain rewards and improve relationships
6. **Respond to Crises** - Handle emergencies that threaten the village

### Game Mechanics

#### Player Stats
- **Health (0-100)**: Your life force. Restore with food and medicine.
- **Stamina (0-100)**: Depletes when moving and gathering. Regenerates over time.
- **Knowledge Points**: Earned by completing quests and learning from villagers.
- **Influence (0-100)**: Community trust level. Increases through positive actions.

#### Village Metrics
- **Happiness**: Overall village morale
- **Food Supply**: Available food for the community
- **Health**: General health status of villagers
- **Security**: Protection level from threats

#### Relationship System
- Build relationships with villagers through:
  - Conversations
  - Completing personal quests
  - Helping during crises
  - Gift-giving
- Higher relationships unlock:
  - New dialogue options
  - Special quests
  - Skills and knowledge
  - Support during important decisions

#### Time System
- **Day Counter**: Tracks days survived
- **Time of Day**: Morning, Afternoon, Evening, Night
- **Daily Resource Consumption**: Village consumes food daily
- **Stamina Regeneration**: Recovers over time

## 📁 Project Structure

```
sifiso/
├── src/
│   ├── components/         # React UI components
│   │   ├── PhaserGame.jsx  # Phaser game wrapper
│   │   ├── GameHUD.jsx     # Heads-up display
│   │   ├── DialogueBox.jsx # Conversation UI
│   │   └── InventoryPanel.jsx # Inventory management
│   ├── scenes/             # Phaser game scenes
│   │   └── VillageScene.js # Main village scene
│   ├── store/              # Zustand state management
│   │   └── gameStore.js    # Global game state
│   ├── data/               # Game content (JSON)
│   │   ├── villagers.json  # Villager data
│   │   └── items.json      # Item definitions
│   ├── config/             # Configuration files
│   │   └── phaserConfig.js # Phaser settings
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styling
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Game Engine**: Phaser 3
- **State Management**: Zustand (with localStorage persistence)
- **Build Tool**: Vite
- **Audio**: Howler.js (for future audio implementation)
- **Styling**: CSS3 with modern features

## 🎨 Architecture Overview

### React + Phaser Hybrid

The game uses a hybrid architecture:

1. **Phaser** handles the game world rendering, physics, and game loop
2. **React** manages the UI overlays (HUD, dialogues, inventory)
3. **Zustand** serves as the single source of truth for game state
4. **Event System** bridges Phaser and React

### State Management

All game state is managed through Zustand:
- Player stats and inventory
- Village metrics
- Villager relationships
- Quest progress
- Time and crises
- UI state

State persists to localStorage automatically for save/load functionality.

### Scene Structure

- **VillageScene**: Main hub with explorable village, NPCs, and buildings
- *(Future)* **ExplorationScene**: Wilderness areas for resource gathering
- *(Future)* **CrisisScene**: Special scenes for major crisis events

## 🎯 Current Features (v0.1.0)

✅ **Implemented:**
- Player movement with WASD/Arrow keys
- Explorable village environment with buildings and resources
- 5 unique villagers with relationship tracking
- Dialogue system with branching conversations
- Inventory system with item management
- Resource gathering mechanics
- Quest tracking system
- Day/night time system
- Village metrics monitoring
- HUD with player and village stats
- Notification system
- Save/load with localStorage persistence

🚧 **Planned Features:**
- Crisis system (storms, droughts, disease outbreaks)
- Crafting system
- More quests (10-15 main quests, 20-30 side quests)
- Exploration scene (wilderness areas)
- Skill tree and knowledge system
- Audio and sound effects
- More villagers (15-20 total)
- Season system
- Weather effects
- Achievement system

## 🎮 Tips for Players

1. **Talk to Everyone**: Each villager has unique knowledge and quests
2. **Manage Stamina**: Rest when stamina is low to avoid penalties
3. **Gather Early**: Stock up on resources before crises hit
4. **Build Relationships**: Higher relationships unlock better rewards
5. **Watch Village Metrics**: Low food or happiness can trigger problems
6. **Complete Quests**: Quests provide knowledge points and influence
7. **Explore Thoroughly**: Find all resource nodes and hidden areas

## 🐛 Known Issues

- Placeholder graphics (colored circles) are used instead of sprites
- Audio system not yet implemented
- Some UI animations could be smoother
- Limited dialogue variations

## 🤝 Future Enhancements

1. **Visual Assets**: Replace placeholder graphics with proper pixel art
2. **Audio**: Add background music and sound effects
3. **More Content**: Expand quest lines, villagers, and story
4. **Crisis Events**: Implement full crisis system with preparation phases
5. **Crafting**: Add recipe book and crafting stations
6. **Skills**: Implement full skill tree with unlockable abilities
7. **Multiplayer**: Consider co-op gameplay (long-term)
8. **Mobile Support**: Optimize for touch controls

## 📝 Development Notes

- The game uses Phaser 3's Arcade Physics for collision detection
- All game state persists to localStorage under the key `sifiso-game-storage`
- Placeholder graphics are generated programmatically in VillageScene
- The dialogue system supports relationship-based branching
- Resource nodes regenerate over time (not yet implemented)

## 📄 License

This project is a prototype/learning project. All rights reserved.

## 🙏 Acknowledgments

- Built with love for the community
- Inspired by classic adventure games and African storytelling traditions
- Thanks to the Phaser and React communities for excellent documentation

---

**Enjoy your journey as Sifiso, the Heart of the Island!** 🌴🌊✨
