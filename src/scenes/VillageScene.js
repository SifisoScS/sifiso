import Phaser from 'phaser';

/**
 * VillageScene - Main hub where player interacts with villagers and buildings
 */
export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
    this.player = null;
    this.cursors = null;
    this.interactKey = null;
    this.nearbyInteractable = null;
    this.villagers = [];
    this.gameStore = null;
  }

  /**
   * Initialize scene with game store reference
   */
  init(data) {
    this.gameStore = data.gameStore;
  }

  /**
   * Preload assets
   */
  preload() {
    // Create placeholder graphics for now (replace with actual sprites later)
    this.createPlaceholderAssets();
  }

  /**
   * Create placeholder graphics for development
   */
  createPlaceholderAssets() {
    // Player sprite
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x4a90e2, 1);
    playerGraphics.fillCircle(16, 16, 12);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Villager sprites
    const colors = [0xe27d60, 0x85dcb0, 0xe8a87c, 0xc38d9e, 0x41b3a3];
    colors.forEach((color, index) => {
      const villagerGraphics = this.add.graphics();
      villagerGraphics.fillStyle(color, 1);
      villagerGraphics.fillCircle(16, 16, 10);
      villagerGraphics.generateTexture(`villager${index}`, 32, 32);
      villagerGraphics.destroy();
    });

    // Building sprites
    const buildingGraphics = this.add.graphics();
    buildingGraphics.fillStyle(0x8b7355, 1);
    buildingGraphics.fillRect(0, 0, 80, 80);
    buildingGraphics.fillStyle(0xa0826d, 1);
    buildingGraphics.fillRect(10, 10, 60, 40);
    buildingGraphics.generateTexture('building', 80, 80);
    buildingGraphics.destroy();

    // Ground tile
    const groundGraphics = this.add.graphics();
    groundGraphics.fillStyle(0x5a7c5a, 1);
    groundGraphics.fillRect(0, 0, 32, 32);
    groundGraphics.generateTexture('ground', 32, 32);
    groundGraphics.destroy();

    // Resource node
    const resourceGraphics = this.add.graphics();
    resourceGraphics.fillStyle(0xf4a460, 1);
    resourceGraphics.fillCircle(12, 12, 8);
    resourceGraphics.generateTexture('resource', 24, 24);
    resourceGraphics.destroy();
  }

  /**
   * Create the game world
   */
  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Create ground
    this.createGround();

    // Create buildings
    this.createBuildings();

    // Create resource nodes
    this.createResourceNodes();

    // Create player
    this.createPlayer();

    // Create villagers
    this.createVillagers();

    // Setup camera
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1);

    // Setup input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.interactKey.on('down', () => this.handleInteraction());

    // Add time passage (1 hour every 60 seconds in real time)
    this.time.addEvent({
      delay: 60000,
      callback: () => {
        if (this.gameStore) {
          this.gameStore.getState().advanceTime(1);
        }
      },
      loop: true
    });

    // Emit scene ready event
    this.events.emit('sceneReady');
  }

  /**
   * Create ground tiles
   */
  createGround() {
    const tileSize = 32;
    for (let x = 0; x < 1600; x += tileSize) {
      for (let y = 0; y < 1200; y += tileSize) {
        this.add.image(x, y, 'ground').setOrigin(0, 0);
      }
    }
  }

  /**
   * Create buildings
   */
  createBuildings() {
    const buildings = [
      { x: 200, y: 150, label: "Chief's Hut" },
      { x: 500, y: 150, label: "Healer's Hut" },
      { x: 800, y: 150, label: 'Storage' },
      { x: 200, y: 400, label: 'Fishing Dock' },
      { x: 500, y: 400, label: 'Farm' },
      { x: 800, y: 400, label: 'Workshop' }
    ];

    buildings.forEach(buildingData => {
      const building = this.physics.add.sprite(buildingData.x, buildingData.y, 'building');
      building.setImmovable(true);
      building.body.setSize(70, 70);
      building.label = buildingData.label;
      building.interactable = true;

      // Add collision with player
      this.physics.add.collider(this.player, building);
    });
  }

  /**
   * Create resource gathering points
   */
  createResourceNodes() {
    const nodes = [
      { x: 1200, y: 300, resource: 'wood', name: 'Tree' },
      { x: 1300, y: 500, resource: 'fruit', name: 'Fruit Bush' },
      { x: 1400, y: 200, resource: 'herbs', name: 'Herbs' },
      { x: 100, y: 800, resource: 'fish', name: 'Fishing Spot' }
    ];

    nodes.forEach(nodeData => {
      const node = this.physics.add.sprite(nodeData.x, nodeData.y, 'resource');
      node.interactable = true;
      node.resourceType = nodeData.resource;
      node.resourceName = nodeData.name;
      node.setData('type', 'resource');
    });
  }

  /**
   * Create player character
   */
  createPlayer() {
    const playerState = this.gameStore?.getState().player;
    const startX = playerState?.position.x || 400;
    const startY = playerState?.position.y || 300;

    this.player = this.physics.add.sprite(startX, startY, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(24, 24);
    this.player.setDepth(10);
  }

  /**
   * Create villagers in the scene
   */
  createVillagers() {
    // Get villagers from game store
    const villagersData = this.gameStore?.getState().villagers || [];

    if (villagersData.length === 0) {
      // Create default villagers if none exist
      const defaultPositions = [
        { x: 300, y: 200 },
        { x: 600, y: 250 },
        { x: 900, y: 200 },
        { x: 350, y: 500 },
        { x: 650, y: 550 }
      ];

      defaultPositions.forEach((pos, index) => {
        const villager = this.physics.add.sprite(pos.x, pos.y, `villager${index % 5}`);
        villager.setImmovable(true);
        villager.interactable = true;
        villager.villagerId = `villager_${index}`;
        villager.villagerName = `Villager ${index + 1}`;
        villager.setData('type', 'villager');
        this.villagers.push(villager);

        // Add idle animation (simple bob up and down)
        this.tweens.add({
          targets: villager,
          y: villager.y - 5,
          duration: 2000 + Math.random() * 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      });
    }
  }

  /**
   * Update loop
   */
  update() {
    if (!this.player) return;

    this.handlePlayerMovement();
    this.checkNearbyInteractables();
    this.updatePlayerPosition();
  }

  /**
   * Handle player movement
   */
  handlePlayerMovement() {
    const speed = 160;
    const gameState = this.gameStore?.getState();

    // Reduce speed if low stamina
    const staminaMultiplier = gameState?.player.stamina > 20 ? 1 : 0.5;
    const currentSpeed = speed * staminaMultiplier;

    let velocityX = 0;
    let velocityY = 0;

    // Check keyboard input
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -currentSpeed;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = currentSpeed;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -currentSpeed;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = currentSpeed;
    }

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    this.player.setVelocity(velocityX, velocityY);

    // Drain stamina when moving
    if ((velocityX !== 0 || velocityY !== 0) && gameState) {
      const staminaDrain = 0.05;
      const currentStamina = gameState.player.stamina;
      if (currentStamina > 0) {
        gameState.updatePlayerStats({ stamina: Math.max(0, currentStamina - staminaDrain) });
      }
    }
  }

  /**
   * Check for nearby interactable objects
   */
  checkNearbyInteractables() {
    const interactionRadius = 50;
    let closestInteractable = null;
    let closestDistance = interactionRadius;

    // Check all interactable objects
    this.children.list.forEach(obj => {
      if (obj.interactable && obj !== this.player) {
        const distance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          obj.x,
          obj.y
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestInteractable = obj;
        }
      }
    });

    // Update nearby interactable
    if (this.nearbyInteractable !== closestInteractable) {
      this.nearbyInteractable = closestInteractable;

      // Emit event for UI to show/hide interaction prompt
      this.events.emit('nearbyInteractableChanged', this.nearbyInteractable);
    }
  }

  /**
   * Handle interaction with nearby object
   */
  handleInteraction() {
    if (!this.nearbyInteractable) return;

    const obj = this.nearbyInteractable;
    const type = obj.getData('type');

    if (type === 'villager') {
      // Start dialogue
      this.events.emit('startDialogue', {
        villagerId: obj.villagerId,
        villagerName: obj.villagerName
      });
    } else if (type === 'resource') {
      // Gather resource
      this.gatherResource(obj);
    } else if (obj.label) {
      // Interact with building
      this.events.emit('buildingInteraction', {
        buildingName: obj.label
      });
    }
  }

  /**
   * Gather resource from node
   */
  gatherResource(node) {
    const gameState = this.gameStore?.getState();
    if (!gameState) return;

    // Check stamina
    if (gameState.player.stamina < 10) {
      this.events.emit('showNotification', {
        message: 'Too tired to gather resources!',
        type: 'warning'
      });
      return;
    }

    // Drain stamina
    gameState.updatePlayerStats({
      stamina: Math.max(0, gameState.player.stamina - 10)
    });

    // Add resource to inventory
    const resourceItem = {
      id: node.resourceType,
      name: node.resourceName,
      type: 'resource',
      quantity: 1,
      stackable: true
    };

    gameState.addToInventory(resourceItem);

    // Emit resource gathered event for sound effect
    this.events.emit('resourceGathered', { resource: node.resourceType });

    // Show gathering animation
    const text = this.add.text(node.x, node.y - 30, '+1 ' + node.resourceName, {
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });

    this.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy()
    });

    // Advance time slightly
    gameState.advanceTime(0.5);
  }

  /**
   * Update player position in store
   */
  updatePlayerPosition() {
    if (this.player && this.gameStore) {
      const state = this.gameStore.getState();
      if (state.player.position.x !== this.player.x ||
          state.player.position.y !== this.player.y) {
        state.updatePlayerPosition({
          x: Math.round(this.player.x),
          y: Math.round(this.player.y),
          scene: 'village'
        });
      }
    }
  }

  /**
   * Clean up when scene shuts down
   */
  shutdown() {
    this.events.off('sceneReady');
    this.events.off('nearbyInteractableChanged');
    this.events.off('startDialogue');
    this.events.off('buildingInteraction');
    this.events.off('showNotification');
  }
}
