import { Level } from '@/constants/levelData';
import { Player } from './Player';
import { Platform } from './Platform';
import { Obstacle } from './Obstacle';
import { Collectible } from './Collectible';
import { Background } from './Background';
import { checkCollision } from '@/utils/physics';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private level: Level;
  private player!: Player; // Using definite assignment assertion
  private platforms: Platform[] = [];
  private obstacles: Obstacle[] = [];
  private collectibles: Collectible[] = [];
  private background!: Background; // Using definite assignment assertion
  private camera = { x: 0, y: 0 };
  private playerPowers: Set<string>;
  private collectedDocuments: Set<string>;
  private onCollectDocument: (documentId: string) => void;
  private onLevelComplete: () => void;
  private gameWidth: number;
  private gameHeight: number;
  private worldWidth: number = 0;
  private worldHeight: number = 0;
  
  // Camera smooth following
  private cameraLerpFactor: number = 0.1; // Lower for smoother camera, higher for quicker response

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    level: Level,
    playerPowers: Set<string>,
    collectedDocuments: Set<string>,
    onCollectDocument: (documentId: string) => void,
    onLevelComplete: () => void
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.level = level;
    this.playerPowers = playerPowers;
    this.collectedDocuments = collectedDocuments;
    this.onCollectDocument = onCollectDocument;
    this.onLevelComplete = onLevelComplete;
    this.gameWidth = canvas.width;
    this.gameHeight = canvas.height;

    // Initialize game elements
    this.initializeGameElements();
    
    // Calculate world boundaries
    this.calculateWorldBoundaries();
  }

  private initializeGameElements() {
    // Create player
    this.player = new Player(
      this.level.startPosition.x,
      this.level.startPosition.y,
      48, // width
      64, // height
      this.playerPowers
    );

    // Create platforms
    this.platforms = this.level.platforms.map(platform => new Platform(
      platform.x,
      platform.y,
      platform.width,
      platform.height,
      platform.type || 'normal',
      {
        isMoving: platform.isMoving || false,
        moveAxis: platform.moveAxis || 'x',
        moveDistance: platform.moveDistance || 0,
        moveSpeed: platform.moveSpeed || 0,
        moveDirection: platform.moveDirection || 1
      }
    ));

    // Create obstacles
    this.obstacles = this.level.obstacles.map(obstacle => new Obstacle(
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height,
      obstacle.type
    ));

    // Create collectibles
    this.collectibles = this.level.collectibles
      .filter(item => !this.collectedDocuments.has(item.id))
      .map(collectible => new Collectible(
        collectible.x,
        collectible.y,
        40, // width
        48, // height
        collectible.type,
        collectible.id
      ));

    // Initialize background with parallax layers
    this.background = new Background(
      this.level.backgroundLayers,
      this.gameWidth,
      this.gameHeight
    );
    
    // Set initial camera position to center on player
    this.updateCamera(true);
  }
  
  private calculateWorldBoundaries() {
    // Find the extreme coordinates in the level
    let minX = this.level.startPosition.x;
    let maxX = this.level.endPosition.x;
    let minY = 0;
    let maxY = 0;
    
    // Check platforms
    this.platforms.forEach(platform => {
      minX = Math.min(minX, platform.x);
      maxX = Math.max(maxX, platform.x + platform.width);
      minY = Math.min(minY, platform.y);
      maxY = Math.max(maxY, platform.y + platform.height);
    });
    
    // Check obstacles
    this.obstacles.forEach(obstacle => {
      minX = Math.min(minX, obstacle.x);
      maxX = Math.max(maxX, obstacle.x + obstacle.width);
      minY = Math.min(minY, obstacle.y);
      maxY = Math.max(maxY, obstacle.y + obstacle.height);
    });
    
    // Check collectibles
    this.collectibles.forEach(collectible => {
      minX = Math.min(minX, collectible.x);
      maxX = Math.max(maxX, collectible.x + collectible.width);
      minY = Math.min(minY, collectible.y);
      maxY = Math.max(maxY, collectible.y + collectible.height);
    });
    
    // Add some margin
    minX -= 200;
    maxX += 200;
    minY -= 200;
    maxY += 200;
    
    this.worldWidth = maxX - minX;
    this.worldHeight = maxY - minY;
  }

  // Track game timer for respawn delay and other time-based events
  private respawnDelay: number = 30; // frames before respawning
  private respawnTimer: number = 0;
  private isRespawning: boolean = false;
  private lastFrameTime: number = 0;
  private targetDelta: number = 16.67; // Target 60fps (1000ms / 60fps)
  
  // Reset the game engine animation frame timing when level resets
  public resetTimer() {
    this.lastFrameTime = 0;
  }

  public update() {
    // Calculate time delta for framerate independence
    const now = performance.now();
    
    // Ensure consistent speed by enforcing a fixed delta time
    // This prevents speed doubling issues when restarting
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = now - this.targetDelta;
    }
    
    // Limit maximum delta to avoid "time jump" after pauses
    const rawDelta = Math.min(now - this.lastFrameTime, 100);
    const delta = rawDelta / this.targetDelta; // Normalize to target frame rate
    this.lastFrameTime = now;

    // Check if player is falling out of the level
    if (!this.isRespawning && this.player.y > this.worldHeight + 200) {
      this.isRespawning = true;
      this.respawnTimer = this.respawnDelay;
    }

    // Handle respawning
    if (this.isRespawning) {
      this.respawnTimer--;
      if (this.respawnTimer <= 0) {
        this.respawnPlayer();
        this.isRespawning = false;
      }
      return; // Skip other updates during respawn
    }

    // Update player position and state
    this.player.update();

    // Apply gravity to player
    this.player.applyGravity();
    
    // Update platforms (for moving platforms)
    this.platforms.forEach(platform => platform.update());

    // Handle collisions with platforms
    this.handlePlatformCollisions();

    // Handle collisions with obstacles
    this.handleObstacleCollisions();

    // Handle collisions with collectibles
    this.handleCollectibleCollisions();

    // Update camera position based on player position
    this.updateCamera();

    // Check if player reached the end position
    this.checkLevelCompletion();
    
    // Update collectibles (for floating animation)
    this.collectibles.forEach(collectible => collectible.update());
  }
  
  // Respawn player at level start
  private respawnPlayer() {
    this.player.x = this.level.startPosition.x;
    this.player.y = this.level.startPosition.y;
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.updateCamera(true); // Immediately center camera on respawned player
  }

  private handlePlatformCollisions() {
    // Reset player's ground state
    this.player.canJump = false;
    
    for (const platform of this.platforms) {
      const collision = checkCollision(this.player, platform);
      
      if (collision.collided) {
        if (collision.direction === 'bottom' && this.player.velocityY >= 0) {
          // Player landed on platform - snap precisely to top
          this.player.y = platform.y - this.player.height;
          this.player.velocityY = 0;
          this.player.canJump = true;
        } else if (collision.direction === 'top' && this.player.velocityY < 0) {
          // Player hit platform from below
          this.player.y = platform.y + platform.height;
          this.player.velocityY = 0;
        } else if (collision.direction === 'right' && this.player.velocityX < 0) {
          // Player hit platform from right
          this.player.x = platform.x + platform.width;
          this.player.velocityX = 0;
        } else if (collision.direction === 'left' && this.player.velocityX > 0) {
          // Player hit platform from left
          this.player.x = platform.x - this.player.width;
          this.player.velocityX = 0;
        }
      }
    }
  }

  private handleObstacleCollisions() {
    for (const obstacle of this.obstacles) {
      // Skip completely destroyed obstacles
      if (obstacle.isDestroyed) continue;
      
      const collision = checkCollision(this.player, obstacle);
      
      if (collision.collided) {
        // If player has the right power, trigger obstacle destruction
        if (this.player.hasPowerToDestroyObstacle(obstacle.type)) {
          if (!obstacle.isBeingDestroyed) {
            // Start destruction animation
            obstacle.destroy();
            
            // Add a small "bounce" effect to the player
            if (collision.direction === 'bottom') {
              this.player.velocityY = this.player.jumpForce / 2; // Smaller jump
            } else if (collision.direction === 'top') {
              this.player.velocityY = Math.abs(this.player.jumpForce / 3); // Bounce down
            } else if (collision.direction === 'left') {
              this.player.velocityX = this.player.maxSpeed; // Bounce right
            } else if (collision.direction === 'right') {
              this.player.velocityX = -this.player.maxSpeed; // Bounce left
            }
          }
        } else if (!obstacle.isBeingDestroyed) {
          // For active obstacles, block player movement
          if (collision.direction === 'bottom' && this.player.velocityY > 0) {
            this.player.y = obstacle.y - this.player.height;
            this.player.velocityY = 0;
            this.player.canJump = true;
          } else if (collision.direction === 'top' && this.player.velocityY < 0) {
            this.player.y = obstacle.y + obstacle.height;
            this.player.velocityY = 0;
          } else if (collision.direction === 'right' && this.player.velocityX < 0) {
            this.player.x = obstacle.x + obstacle.width;
            this.player.velocityX = 0;
          } else if (collision.direction === 'left' && this.player.velocityX > 0) {
            this.player.x = obstacle.x - this.player.width;
            this.player.velocityX = 0;
          }
        }
      }
    }

    // Remove completely destroyed obstacles (animation finished)
    this.obstacles = this.obstacles.filter(obstacle => !obstacle.isDestroyed);
  }

  private handleCollectibleCollisions() {
    for (let i = 0; i < this.collectibles.length; i++) {
      const collectible = this.collectibles[i];
      const collision = checkCollision(this.player, collectible);
      
      if (collision.collided) {
        // Player collected an item
        this.onCollectDocument(collectible.id);
        
        // Add the document to player's powers immediately
        this.playerPowers.add(collectible.id);
        
        // Update the player's powers
        this.player.powers.add(collectible.id);
        
        // Remove the collectible
        this.collectibles.splice(i, 1);
        i--;
      }
    }
  }

  private updateCamera(immediate: boolean = false) {
    // Calculate the target camera position to center on player
    const targetX = this.player.x - (this.gameWidth / 2) + (this.player.width / 2);
    const targetY = this.player.y - (this.gameHeight / 2) + (this.player.height / 2);
    
    // Apply smooth camera following with linear interpolation
    if (immediate) {
      // Set camera position immediately
      this.camera.x = targetX;
      this.camera.y = targetY;
    } else {
      // Smoothly transition camera to target position
      this.camera.x += (targetX - this.camera.x) * this.cameraLerpFactor;
      this.camera.y += (targetY - this.camera.y) * this.cameraLerpFactor;
    }
    
    // Clamp camera to world boundaries
    this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldWidth - this.gameWidth));
    
    // Only clamp Y if world is taller than screen
    if (this.worldHeight > this.gameHeight) {
      this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldHeight - this.gameHeight));
    } else {
      // If world is shorter than screen, center it vertically
      this.camera.y = Math.max(0, (this.worldHeight - this.gameHeight) / 2);
    }
  }

  private checkLevelCompletion() {
    // Check if player has reached the end position
    const distanceToEnd = Math.sqrt(
      Math.pow(this.player.x - this.level.endPosition.x, 2) + 
      Math.pow(this.player.y - this.level.endPosition.y, 2)
    );
    
    // More forgiving end position detection
    if (distanceToEnd < 100) {
      this.onLevelComplete();
    }
  }

  public render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render background with parallax effect based on camera position
    this.background.render(this.ctx, this.camera.x);

    // Save the context state before transformations
    this.ctx.save();
    
    // Apply camera transform to make world move around player
    // This centers the viewport on the player position
    const cameraOffsetX = -this.camera.x;
    const cameraOffsetY = -this.camera.y;
    
    // Render platforms
    for (const platform of this.platforms) {
      platform.render(this.ctx, cameraOffsetX, cameraOffsetY);
    }

    // Render obstacles
    for (const obstacle of this.obstacles) {
      obstacle.render(this.ctx, cameraOffsetX, cameraOffsetY);
    }

    // Render collectibles
    for (const collectible of this.collectibles) {
      collectible.render(this.ctx, cameraOffsetX, cameraOffsetY);
    }

    // Render player in the center of screen
    this.player.render(this.ctx, cameraOffsetX, cameraOffsetY);

    // Render end flag
    this.renderEndFlag(cameraOffsetX, cameraOffsetY);
    
    // Debug: Draw world boundaries 
    /*
    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      cameraOffsetX, 
      cameraOffsetY, 
      this.worldWidth, 
      this.worldHeight
    );
    */
    
    // Restore the context state
    this.ctx.restore();
  }

  private renderEndFlag(cameraOffsetX: number, cameraOffsetY: number) {
    const flagX = this.level.endPosition.x;
    const flagY = this.level.endPosition.y - 100; // Place the flag above the end platform
    
    // Save context for transformations
    this.ctx.save();
    
    // Draw flagpole
    this.ctx.fillStyle = '#F5F0DC'; // Off-white
    this.ctx.fillRect(flagX + cameraOffsetX, flagY + cameraOffsetY, 6, 100);
    
    // Add 3D effect to flagpole
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.fillRect(flagX + cameraOffsetX, flagY + cameraOffsetY, 2, 100);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(flagX + cameraOffsetX + 4, flagY + cameraOffsetY, 2, 100);
    
    // Draw a decorative base for the flagpole
    this.ctx.fillStyle = '#3A5E8C'; // Medium blue
    this.ctx.fillRect(flagX - 4 + cameraOffsetX, flagY + 95 + cameraOffsetY, 14, 8);
    this.ctx.fillStyle = '#1A2E55'; // Navy blue
    this.ctx.fillRect(flagX - 7 + cameraOffsetX, flagY + 103 + cameraOffsetY, 20, 5);
    
    // Calculate flag wave using sine function for natural movement
    const waveAmount = Math.sin(Date.now() / 200) * 5;
    const flagHeight = 20;
    const flagWidth = 30;
    
    // Draw flag with waving effect
    this.ctx.fillStyle = '#B22234'; // Vintage red
    
    // Create path for waving flag
    this.ctx.beginPath();
    this.ctx.moveTo(flagX + 6 + cameraOffsetX, flagY + 5 + cameraOffsetY);
    
    // Top edge with wave
    for (let i = 0; i < flagWidth; i++) {
      const waveY = Math.sin((Date.now() / 200) + (i * 0.2)) * waveAmount;
      this.ctx.lineTo(
        flagX + 6 + i + cameraOffsetX,
        flagY + 5 + waveY + cameraOffsetY
      );
    }
    
    // Right edge
    this.ctx.lineTo(flagX + 6 + flagWidth + cameraOffsetX, flagY + 5 + flagHeight + cameraOffsetY);
    
    // Bottom edge with wave
    for (let i = flagWidth; i > 0; i--) {
      const waveY = Math.sin((Date.now() / 200) + (i * 0.2)) * waveAmount * 0.5;
      this.ctx.lineTo(
        flagX + 6 + i + cameraOffsetX,
        flagY + 5 + flagHeight + waveY + cameraOffsetY
      );
    }
    
    // Close path
    this.ctx.closePath();
    this.ctx.fill();
    
    // Add stripes to the flag (like US flag)
    this.ctx.fillStyle = 'white';
    for (let i = 0; i < 3; i++) {
      const stripeY = flagY + 8 + (i * 5) + cameraOffsetY;
      
      // Create each white stripe with wave
      this.ctx.beginPath();
      this.ctx.moveTo(flagX + 6 + cameraOffsetX, stripeY);
      
      for (let j = 0; j < flagWidth; j++) {
        const waveY = Math.sin((Date.now() / 200) + (j * 0.2)) * waveAmount * 0.7;
        this.ctx.lineTo(
          flagX + 6 + j + cameraOffsetX,
          stripeY + waveY
        );
      }
      
      // Draw with small height
      this.ctx.lineTo(flagX + 6 + flagWidth + cameraOffsetX, stripeY + 2);
      this.ctx.lineTo(flagX + 6 + cameraOffsetX, stripeY + 2);
      this.ctx.closePath();
      this.ctx.fill();
    }
    
    // Add a small blue canton with stars
    this.ctx.fillStyle = '#3C3B6E'; // Blue for the canton
    this.ctx.fillRect(flagX + 6 + cameraOffsetX, flagY + 5 + cameraOffsetY, 12, 10);
    
    // Draw stars
    this.ctx.fillStyle = 'white';
    this.drawStar(flagX + 10 + cameraOffsetX, flagY + 8 + cameraOffsetY, 1, 3, 5);
    this.drawStar(flagX + 14 + cameraOffsetX, flagY + 12 + cameraOffsetY, 1, 3, 5);
    
    // Add an occasional animation of sparkles at the top of the flagpole
    if (Math.random() < 0.03) {
      this.drawSparkle(flagX + 3 + cameraOffsetX, flagY + cameraOffsetY);
    }
    
    // Restore context
    this.ctx.restore();
  }
  
  private drawStar(cx: number, cy: number, innerRadius: number, outerRadius: number, points: number) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / points;
    
    this.ctx.beginPath();
    
    for (let i = 0; i < points; i++) {
      // Outer point
      this.ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      
      // Inner point
      this.ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }
    
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  private drawSparkle(x: number, y: number) {
    const size = 4 + Math.random() * 2;
    
    // Create radial gradient for glow effect
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 100, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  public setPlayerMovement(direction: 'left' | 'right' | 'jump', active: boolean) {
    if (direction === 'left') {
      this.player.isMovingLeft = active;
    } else if (direction === 'right') {
      this.player.isMovingRight = active;
    } else if (direction === 'jump' && active) {
      // Only allow jump if player is on the ground
      if (this.player.canJump) {
        this.player.jump();
      }
    }
  }

  public handleResize(width: number, height: number) {
    this.gameWidth = width;
    this.gameHeight = height;
    this.background.resize(width, height);
    
    // Update camera when screen size changes to maintain player centering
    this.updateCamera(true);
  }

  public cleanup() {
    // Any cleanup needed when component unmounts
  }
}
