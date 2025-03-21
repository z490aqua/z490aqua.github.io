import { Entity } from './Entity';
import { getLegislatorSVG } from '@/assets/svgs/legislator';

// Player state enum - for cleaner state management
enum PlayerState {
  IDLE,
  RUNNING,
  JUMPING,
  FALLING
}

export class Player extends Entity {
  // Movement flags
  isMovingLeft: boolean;
  isMovingRight: boolean;
  canJump: boolean;
  
  // Physics properties
  jumpForce: number;
  moveSpeed: number;
  maxSpeed: number;  // Maximum horizontal speed
  acceleration: number; // How quickly the player reaches max speed
  deceleration: number; // How quickly the player slows down
  gravity: number;
  terminalVelocity: number;
  
  // State properties
  powers: Set<string>;
  facingRight: boolean;
  currentState: PlayerState;
  wasOnGround: boolean;
  
  // Animation properties
  sprite: HTMLImageElement | null;
  animationFrame: number;
  animationTick: number;
  animationTicksPerFrame: number;
  
  // Special abilities
  jumpBufferTime: number;
  jumpBufferTimer: number;
  coyoteTime: number;
  coyoteTimer: number;
  
  constructor(x: number, y: number, width: number, height: number, powers: Set<string>) {
    super(x, y, width, height);
    
    // Initialize movement flags
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.canJump = false;
    this.wasOnGround = false;
    
    // Set physics constants for responsive movement
    this.jumpForce = -18; // Reduced from -22 for more consistent jumping
    this.moveSpeed = 4; // Reduced from 5 for slower movement
    this.maxSpeed = 6; // Reduced from 8 for slower maximum speed
    this.acceleration = 0.4; // Reduced from 0.5 for slower acceleration
    this.deceleration = 0.8; // More friction (reduced from 0.85)
    this.gravity = 0.65; // Adjusted for better jump feel
    this.terminalVelocity = 18; // Reduced from 20
    
    // Set state properties
    this.powers = powers;
    this.facingRight = true;
    this.currentState = PlayerState.IDLE;
    
    // Initialize animation properties
    this.sprite = null;
    this.animationFrame = 0;
    this.animationTick = 0;
    this.animationTicksPerFrame = 5;
    
    // Special movement abilities
    this.jumpBufferTime = 10; // Frames to buffer a jump input
    this.jumpBufferTimer = 0;
    this.coyoteTime = 5; // Frames to allow jumping after leaving a platform
    this.coyoteTimer = 0;
    
    // Create sprite from SVG
    this.createSpriteFromSVG();
  }
  
  createSpriteFromSVG() {
    const svgString = getLegislatorSVG();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = () => {
      this.sprite = img;
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }
  
  update() {
    // Check if player was on ground last frame
    const wasOnGround = this.canJump;
    
    // Handle horizontal movement with acceleration/deceleration
    this.handleHorizontalMovement();
    
    // Handle jump buffer
    this.handleJumpBuffer();
    
    // Handle coyote time (brief window to jump after leaving platform)
    this.handleCoyoteTime(wasOnGround);
    
    // Update position based on velocity
    super.update();
    
    // Update player state based on conditions
    this.updateState();
    
    // Update animation based on current state
    this.updateAnimation();
  }
  
  handleHorizontalMovement() {
    // Apply acceleration/deceleration for smoother movement
    if (this.isMovingLeft) {
      // Accelerate left
      this.velocityX = Math.max(-this.maxSpeed, this.velocityX - this.acceleration);
      this.facingRight = false;
    } else if (this.isMovingRight) {
      // Accelerate right
      this.velocityX = Math.min(this.maxSpeed, this.velocityX + this.acceleration);
      this.facingRight = true;
    } else {
      // Apply deceleration/friction when not actively moving
      this.velocityX *= this.deceleration;
      
      // Stop completely when below threshold to prevent sliding
      if (Math.abs(this.velocityX) < 0.1) {
        this.velocityX = 0;
      }
    }
  }
  
  handleJumpBuffer() {
    // Decrement jump buffer timer
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer--;
      
      // If we can jump during the buffer window, execute the jump
      if (this.canJump) {
        this.velocityY = this.jumpForce;
        this.canJump = false;
        this.jumpBufferTimer = 0;
      }
    }
  }
  
  handleCoyoteTime(wasOnGround: boolean) {
    // If player was on ground last frame but not now, start coyote timer
    if (wasOnGround && !this.canJump) {
      this.coyoteTimer = this.coyoteTime;
    }
    
    // Decrement coyote timer
    if (this.coyoteTimer > 0) {
      this.coyoteTimer--;
    }
  }
  
  updateState() {
    // Determine current state based on velocity and ground contact
    if (this.canJump) {
      if (Math.abs(this.velocityX) > 0.5) {
        this.currentState = PlayerState.RUNNING;
      } else {
        this.currentState = PlayerState.IDLE;
      }
    } else {
      if (this.velocityY < 0) {
        this.currentState = PlayerState.JUMPING;
      } else {
        this.currentState = PlayerState.FALLING;
      }
    }
  }
  
  updateAnimation() {
    // Animation speed varies based on state
    let ticksPerFrame = this.animationTicksPerFrame;
    
    // Running animations are faster
    if (this.currentState === PlayerState.RUNNING) {
      ticksPerFrame = 3;
    }
    
    // Increment animation tick
    this.animationTick++;
    if (this.animationTick >= ticksPerFrame) {
      this.animationTick = 0;
      
      // Frame count depends on animation state
      const frameCount = this.currentState === PlayerState.IDLE ? 2 : 4;
      this.animationFrame = (this.animationFrame + 1) % frameCount;
    }
  }
  
  jump() {
    // If on ground or in coyote time, jump immediately
    if (this.canJump || this.coyoteTimer > 0) {
      this.velocityY = this.jumpForce;
      this.canJump = false;
      this.coyoteTimer = 0;
    } else {
      // Otherwise, buffer the jump for a short time
      this.jumpBufferTimer = this.jumpBufferTime;
    }
  }
  
  applyGravity() {
    // Apply gravity
    this.velocityY += this.gravity;
    
    // Enforce terminal velocity
    if (this.velocityY > this.terminalVelocity) {
      this.velocityY = this.terminalVelocity;
    }
  }
  
  hasPowerToDestroyObstacle(obstacleType: string): boolean {
    // Map obstacle types to the power needed to destroy them
    const powerMap: Record<string, string> = {
      'veto': 'constitution', // Bill Passage power from Constitution
      'executiveOrder': 'federalist51', // Checks & Balances power from Federalist 51
      'presidentialDecree': 'billrights' // Civil Liberties power from Bill of Rights
    };
    
    const neededPower = powerMap[obstacleType];
    return neededPower ? this.powers.has(neededPower) : false;
  }
  
  render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0) {
    if (this.sprite) {
      // Draw the player sprite with animation based on state
      ctx.save();
      
      // Position for the sprite
      const drawX = this.x + offsetX;
      const drawY = this.y + offsetY;
      
      // Add subtle bob animation for idle
      let yOffset = 0;
      if (this.currentState === PlayerState.IDLE) {
        yOffset = Math.sin(Date.now() / 300) * 2; // Gentle breathing/bobbing motion
      }
      
      // Add squash and stretch effect for jumping/falling
      let widthScale = 1.0;
      let heightScale = 1.0;
      
      if (this.currentState === PlayerState.JUMPING) {
        // Stretch vertically when jumping
        widthScale = 0.9;
        heightScale = 1.1;
      } else if (this.currentState === PlayerState.FALLING) {
        // Squash horizontally when falling
        widthScale = 1.1;
        heightScale = 0.9;
      }
      
      const scaledWidth = this.width * widthScale;
      const scaledHeight = this.height * heightScale;
      
      // Flip the sprite if facing left
      if (!this.facingRight) {
        ctx.translate(drawX + this.width, drawY + yOffset);
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.sprite, 
          0, 0, 
          scaledWidth, scaledHeight
        );
      } else {
        ctx.drawImage(
          this.sprite, 
          drawX, drawY + yOffset, 
          scaledWidth, scaledHeight
        );
      }
      
      // Debug visualization of player state
      /*
      const stateText = PlayerState[this.currentState];
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.fillText(stateText, drawX, drawY - 10);
      */
      
      ctx.restore();
    } else {
      // Fallback to a colored rectangle if sprite is not loaded
      ctx.fillStyle = '#B22234'; // Vintage red
      ctx.fillRect(this.x + offsetX, this.y + offsetY, this.width, this.height);
    }
  }
}
