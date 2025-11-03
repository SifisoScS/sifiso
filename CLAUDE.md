# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sifiso: The Heart of the Island** is a web-based 2D adventure-strategy game where players control Sifiso, a wise savior protecting an island community through intelligence, courage, and compassion.

## Tech Stack

- **Frontend Framework:** React
- **Game Engine:** Phaser 3 for 2D rendering and game loop
- **State Management:** Zustand with localStorage persistence
- **Art Style:** 2D (pixel art or flat vector)
- **Audio:** Howler.js for sound management

## Architecture

The game follows a hybrid React + Phaser architecture:

### State Management (Zustand)
- **Single source of truth** for all game state (player, village, villagers, quests, crises)
- React components consume state for UI rendering
- Phaser scenes interact with Zustand store via actions
- localStorage persistence for save/load functionality

### Scene Architecture (Phaser 3)
The game is organized into multiple interconnected Phaser scenes:
- **VillageScene** - Main hub with explorable village, NPCs, and buildings
- **ExplorationScene** - Island wilderness areas for resource gathering
- **CrisisScene** - Special dedicated scenes for major crisis events
- Scene transitions maintain global game state via Zustand

### Data-Driven Design
Game content is defined in JSON files (stored in `/src/data/` or similar):
- `villagers.json` - 15-20 villagers with personalities, relationships, quests
- `dialogue.json` - Branching conversation trees based on relationship levels and context
- `quests.json` - Main story quests and side quests with multiple solution paths
- `crises.json` - Crisis definitions with triggers, preparation phases, and outcomes
- `items.json` - All game items with effects and crafting recipes
- `knowledge.json` - Skills and knowledge system with unlock trees

### React-Phaser Bridge
- Phaser game runs in a canvas managed by a React component
- Phaser scenes emit custom events consumed by React
- React UI overlays display game state (HUD, dialogue, inventory, etc.)
- User interactions in React trigger Zustand actions that affect Phaser scenes

## Core Game Systems

### 1. Player System
- Health, Stamina, Knowledge Points, Influence (0-100 scales)
- Inventory with categorized items (food, materials, tools, medical)
- Movement with WASD/Arrow keys, collision detection
- Proximity-based interaction system

### 2. Villager System
- Each villager has relationship levels (0-100) that unlock dialogue and quests
- Daily routines tied to time system
- Memory system - villagers remember past conversations and player choices
- React to village state and active crises

### 3. Time & Resource System
- Day/night cycle with visual changes
- Time of day affects villager behaviors and dialogue
- Daily resource consumption (food, supplies)
- Resource gathering requires stamina and sometimes tools

### 4. Crisis System
- Types: Natural disasters (storm, drought, fire), health crises (disease, food poisoning), wildlife/social challenges
- Three-phase structure: Warning/detection → Preparation → Active crisis → Aftermath
- Player decisions during preparation affect crisis severity
- Learning system - better prepared for similar future crises

### 5. Quest System
- Main story quests (10-15) with branching narrative
- Side quests (20-30) from individual villagers
- Multiple solution paths when possible
- Quest outcomes affect village metrics and relationships

## Project Initialization

This repository currently contains only the design specification. When setting up the project:

```bash
# Initialize React project with Vite (recommended for Phaser)
npm create vite@latest . -- --template react
npm install

# Install core dependencies
npm install phaser zustand howler

# Install dev dependencies as needed
npm install -D @types/node
```

## Development Workflow

### When building the initial prototype:
1. Start with foundational architecture (Zustand store + basic Phaser scene)
2. Implement player movement and one test villager interaction
3. Build DialogueBox React component and connect to Phaser events
4. Incrementally add systems: dialogue → quests → crises → crafting
5. Use `/init` command to review full game specification

### Key Implementation Notes:
- Keep Phaser game logic separate from React components
- Use Phaser's event system to communicate from game → React
- Use Zustand actions for React → game communication
- Prioritize playable prototype over visual polish initially
- Test state persistence early (save/load via localStorage)

## Cultural Context

The game features African cultural elements:
- Use culturally appropriate African names for characters and locations
- Themes emphasize community, wisdom, cooperation, and tradition
- Dialogue should reflect diverse personalities while respecting cultural context
- Island lore can draw from African folklore and storytelling traditions

## Slash Commands

- `/init` - Loads the complete game development specification from "Build Sifiso.txt"

## File Organization (To Be Created)

```
/src
  /components       # React UI components (HUD, DialogueBox, Inventory, etc.)
  /scenes          # Phaser scenes (VillageScene, ExplorationScene, etc.)
  /store           # Zustand store definition and actions
  /data            # JSON content files (villagers, quests, crises, etc.)
  /utils           # Helper functions
  /assets          # Game assets (sprites, audio, fonts)
    /sprites
    /audio
    /fonts
```

## Critical Design Principles

1. **Meaningful Choices** - Player decisions should have visible consequences on village state and relationships
2. **Multiple Solutions** - Avoid single "correct" answers; allow different approaches to problems
3. **Progressive Complexity** - Start simple, gradually introduce systems through tutorial and early gameplay
4. **State Visibility** - Players should understand how their actions affect village metrics
5. **Cultural Authenticity** - Respect African cultural elements; avoid stereotypes

## Testing Priorities

- State persistence (save/load)
- Scene transitions without state loss
- Relationship progression mechanics
- Crisis trigger and resolution flows
- Resource gathering and crafting loops
- UI responsiveness overlaying Phaser canvas
