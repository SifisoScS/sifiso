import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Main game store using Zustand
 * Manages all game state including player, village, villagers, quests, and crises
 */
const useGameStore = create(
  persist(
    (set, get) => ({
      // ==================== PLAYER STATE ====================
      player: {
        health: 100,
        stamina: 100,
        knowledgePoints: 0,
        influence: 50,
        position: { x: 400, y: 300, scene: 'village' },
        inventory: [],
        skills: [],
        maxInventorySize: 20
      },

      // ==================== VILLAGE METRICS ====================
      village: {
        population: 18,
        happiness: 75,
        foodSupply: 100,
        health: 85,
        security: 70,
        culturalPreservation: 80
      },

      // ==================== VILLAGERS ====================
      villagers: [],

      // ==================== TIME SYSTEM ====================
      time: {
        day: 1,
        timeOfDay: 'morning', // morning, afternoon, evening, night
        hour: 6,
        season: 'dry' // dry, rainy
      },

      // ==================== QUEST SYSTEM ====================
      quests: {
        active: [],
        completed: [],
        available: []
      },

      // ==================== CRISIS SYSTEM ====================
      crisis: {
        active: null,
        history: [],
        warningLevel: 0
      },

      // ==================== DIALOGUE STATE ====================
      dialogue: {
        isActive: false,
        currentVillager: null,
        currentDialogue: null,
        history: []
      },

      // ==================== UI STATE ====================
      ui: {
        activePanel: null, // 'inventory', 'quests', 'knowledge', 'settings', null
        notifications: []
      },

      // ==================== PLAYER ACTIONS ====================

      /**
       * Update player stats
       */
      updatePlayerStats: (stats) => set((state) => ({
        player: { ...state.player, ...stats }
      })),

      /**
       * Add item to inventory
       */
      addToInventory: (item) => set((state) => {
        if (state.player.inventory.length >= state.player.maxInventorySize) {
          get().addNotification('Inventory is full!', 'warning');
          return state;
        }

        // Check if item is stackable
        const existingItem = state.player.inventory.find(i => i.id === item.id && i.stackable);
        if (existingItem) {
          return {
            player: {
              ...state.player,
              inventory: state.player.inventory.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
              )
            }
          };
        }

        return {
          player: {
            ...state.player,
            inventory: [...state.player.inventory, { ...item, quantity: item.quantity || 1 }]
          }
        };
      }),

      /**
       * Remove item from inventory
       */
      removeFromInventory: (itemId, quantity = 1) => set((state) => ({
        player: {
          ...state.player,
          inventory: state.player.inventory
            .map(item => item.id === itemId ? { ...item, quantity: item.quantity - quantity } : item)
            .filter(item => item.quantity > 0)
        }
      })),

      /**
       * Use item from inventory
       */
      useItem: (itemId) => set((state) => {
        const item = state.player.inventory.find(i => i.id === itemId);
        if (!item) return state;

        let newPlayer = { ...state.player };

        // Apply item effects
        if (item.effects) {
          if (item.effects.health) newPlayer.health = Math.min(100, newPlayer.health + item.effects.health);
          if (item.effects.stamina) newPlayer.stamina = Math.min(100, newPlayer.stamina + item.effects.stamina);
        }

        // Remove one from inventory
        newPlayer.inventory = newPlayer.inventory
          .map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)
          .filter(i => i.quantity > 0);

        return { player: newPlayer };
      }),

      /**
       * Update player position
       */
      updatePlayerPosition: (position) => set((state) => ({
        player: { ...state.player, position: { ...state.player.position, ...position } }
      })),

      /**
       * Add skill to player
       */
      addSkill: (skill) => set((state) => ({
        player: {
          ...state.player,
          skills: [...state.player.skills, skill]
        }
      })),

      // ==================== VILLAGE ACTIONS ====================

      /**
       * Update village metrics
       */
      updateVillageMetrics: (metrics) => set((state) => ({
        village: { ...state.village, ...metrics }
      })),

      /**
       * Consume daily resources
       */
      consumeDailyResources: () => set((state) => {
        const foodConsumption = state.village.population * 0.5;
        const newFoodSupply = Math.max(0, state.village.foodSupply - foodConsumption);
        const happinessChange = newFoodSupply < 30 ? -5 : 0;

        return {
          village: {
            ...state.village,
            foodSupply: newFoodSupply,
            happiness: Math.max(0, Math.min(100, state.village.happiness + happinessChange))
          }
        };
      }),

      // ==================== VILLAGER ACTIONS ====================

      /**
       * Initialize villagers from data
       */
      setVillagers: (villagers) => set({ villagers }),

      /**
       * Update villager relationship
       */
      updateVillagerRelationship: (villagerId, change) => set((state) => ({
        villagers: state.villagers.map(v =>
          v.id === villagerId
            ? { ...v, relationship: Math.max(0, Math.min(100, v.relationship + change)) }
            : v
        )
      })),

      /**
       * Update villager status
       */
      updateVillagerStatus: (villagerId, status) => set((state) => ({
        villagers: state.villagers.map(v =>
          v.id === villagerId ? { ...v, status } : v
        )
      })),

      // ==================== TIME ACTIONS ====================

      /**
       * Advance time
       */
      advanceTime: (hours = 1) => set((state) => {
        let newHour = state.time.hour + hours;
        let newDay = state.time.day;

        // Handle day transition
        if (newHour >= 24) {
          newDay += Math.floor(newHour / 24);
          newHour = newHour % 24;
          get().consumeDailyResources();
        }

        // Determine time of day
        let timeOfDay = 'night';
        if (newHour >= 6 && newHour < 12) timeOfDay = 'morning';
        else if (newHour >= 12 && newHour < 17) timeOfDay = 'afternoon';
        else if (newHour >= 17 && newHour < 21) timeOfDay = 'evening';

        // Regenerate stamina
        const staminaRegen = hours * 5;
        get().updatePlayerStats({
          stamina: Math.min(100, state.player.stamina + staminaRegen)
        });

        return {
          time: {
            ...state.time,
            day: newDay,
            hour: newHour,
            timeOfDay
          }
        };
      }),

      // ==================== QUEST ACTIONS ====================

      /**
       * Start a quest
       */
      startQuest: (quest) => set((state) => ({
        quests: {
          ...state.quests,
          active: [...state.quests.active, { ...quest, progress: 0, startDay: state.time.day }],
          available: state.quests.available.filter(q => q.id !== quest.id)
        }
      })),

      /**
       * Update quest progress
       */
      updateQuestProgress: (questId, progress) => set((state) => ({
        quests: {
          ...state.quests,
          active: state.quests.active.map(q =>
            q.id === questId ? { ...q, progress } : q
          )
        }
      })),

      /**
       * Complete a quest
       */
      completeQuest: (questId) => set((state) => {
        const quest = state.quests.active.find(q => q.id === questId);
        if (!quest) return state;

        // Apply rewards
        if (quest.rewards) {
          if (quest.rewards.knowledgePoints) {
            get().updatePlayerStats({
              knowledgePoints: state.player.knowledgePoints + quest.rewards.knowledgePoints
            });
          }
          if (quest.rewards.influence) {
            get().updatePlayerStats({
              influence: Math.min(100, state.player.influence + quest.rewards.influence)
            });
          }
          if (quest.rewards.items) {
            quest.rewards.items.forEach(item => get().addToInventory(item));
          }
        }

        get().addNotification(`Quest completed: ${quest.title}`, 'success');

        return {
          quests: {
            ...state.quests,
            active: state.quests.active.filter(q => q.id !== questId),
            completed: [...state.quests.completed, { ...quest, completedDay: state.time.day }]
          }
        };
      }),

      /**
       * Set available quests
       */
      setAvailableQuests: (quests) => set((state) => ({
        quests: { ...state.quests, available: quests }
      })),

      // ==================== CRISIS ACTIONS ====================

      /**
       * Trigger a crisis
       */
      triggerCrisis: (crisis) => set((state) => {
        get().addNotification(`CRISIS: ${crisis.title}`, 'danger');
        return {
          crisis: {
            ...state.crisis,
            active: { ...crisis, startDay: state.time.day, phase: 'warning' }
          }
        };
      }),

      /**
       * Update crisis phase
       */
      updateCrisisPhase: (phase) => set((state) => ({
        crisis: {
          ...state.crisis,
          active: state.crisis.active ? { ...state.crisis.active, phase } : null
        }
      })),

      /**
       * Resolve crisis
       */
      resolveCrisis: (outcome) => set((state) => {
        if (!state.crisis.active) return state;

        const crisis = state.crisis.active;

        // Apply crisis outcome effects
        if (outcome.villageEffects) {
          get().updateVillageMetrics(outcome.villageEffects);
        }

        return {
          crisis: {
            active: null,
            history: [
              ...state.crisis.history,
              { ...crisis, outcome, resolvedDay: state.time.day }
            ],
            warningLevel: 0
          }
        };
      }),

      // ==================== DIALOGUE ACTIONS ====================

      /**
       * Start dialogue with villager
       */
      startDialogue: (villagerId, dialogue) => set({
        dialogue: {
          isActive: true,
          currentVillager: villagerId,
          currentDialogue: dialogue,
          history: []
        }
      }),

      /**
       * End dialogue
       */
      endDialogue: () => set((state) => ({
        dialogue: {
          ...state.dialogue,
          isActive: false,
          currentVillager: null,
          currentDialogue: null
        }
      })),

      /**
       * Add to dialogue history
       */
      addToDialogueHistory: (entry) => set((state) => ({
        dialogue: {
          ...state.dialogue,
          history: [...state.dialogue.history, entry]
        }
      })),

      // ==================== UI ACTIONS ====================

      /**
       * Set active UI panel
       */
      setActivePanel: (panel) => set((state) => ({
        ui: { ...state.ui, activePanel: panel }
      })),

      /**
       * Add notification
       */
      addNotification: (message, type = 'info') => set((state) => ({
        ui: {
          ...state.ui,
          notifications: [
            ...state.ui.notifications,
            { id: Date.now(), message, type, timestamp: Date.now() }
          ]
        }
      })),

      /**
       * Remove notification
       */
      removeNotification: (id) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== id)
        }
      })),

      // ==================== SAVE/LOAD ====================

      /**
       * Reset game to initial state
       */
      resetGame: () => set((state) => ({
        player: {
          health: 100,
          stamina: 100,
          knowledgePoints: 0,
          influence: 50,
          position: { x: 400, y: 300, scene: 'village' },
          inventory: [],
          skills: [],
          maxInventorySize: 20
        },
        village: {
          population: 18,
          happiness: 75,
          foodSupply: 100,
          health: 85,
          security: 70,
          culturalPreservation: 80
        },
        time: {
          day: 1,
          timeOfDay: 'morning',
          hour: 6,
          season: 'dry'
        },
        quests: {
          active: [],
          completed: [],
          available: []
        },
        crisis: {
          active: null,
          history: [],
          warningLevel: 0
        },
        dialogue: {
          isActive: false,
          currentVillager: null,
          currentDialogue: null,
          history: []
        },
        ui: {
          activePanel: null,
          notifications: []
        }
      }))
    }),
    {
      name: 'sifiso-game-storage',
      version: 1
    }
  )
);

export default useGameStore;
