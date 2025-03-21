import Matter from 'matter-js';
import { isOnGround, setVelocity, applyImpulse } from './physics';

interface PlayerControls {
  left: boolean;
  right: boolean;
  jump: boolean;
  action: boolean;
}

interface PlayerState {
  onGround: boolean;
  facingRight: boolean;
  jumping: boolean;
  falling: boolean;
  idle: boolean;
  running: boolean;
  action: boolean;
  actionCooldown: number;
}

interface Player {
  controls: PlayerControls;
  state: PlayerState;
  speed: number;
  jumpForce: number;
  width: number;
  height: number;
  update: (deltaTime: number) => void;
}

export const createPlayer = (world: Matter.World, canvasWidth: number, canvasHeight: number) => {
  // Player dimensions
  const width = 30;
  const height = 50;
  
  // Create player body
  const playerBody = Matter.Bodies.rectangle(
    canvasWidth * 0.1,
    canvasHeight * 0.7,
    width,
    height,
    {
      restitution: 0,
      friction: 0.05,
      frictionAir: 0.01,
      render: {
        fillStyle: '#B22234',
        strokeStyle: '#000',
        lineWidth: 1
      }
    }
  );
  
  // Add player to world
  Matter.World.add(world, playerBody);
  
  // Player state and controls
  const player: Player = {
    controls: {
      left: false,
      right: false,
      jump: false,
      action: false
    },
    state: {
      onGround: false,
      facingRight: true,
      jumping: false,
      falling: false,
      idle: true,
      running: false,
      action: false,
      actionCooldown: 0
    },
    speed: 0.5,
    jumpForce: 0.2,
    width,
    height,
    update: (deltaTime: number) => {
      // Check if player is on ground
      player.state.onGround = isOnGround(playerBody);
      
      // Update player state
      player.state.idle = !player.controls.left && !player.controls.right;
      player.state.running = player.controls.left || player.controls.right;
      
      // Handle horizontal movement
      let xVelocity = 0;
      
      if (player.controls.left) {
        xVelocity = -player.speed;
        player.state.facingRight = false;
      }
      if (player.controls.right) {
        xVelocity = player.speed;
        player.state.facingRight = true;
      }
      
      // Set horizontal velocity
      const currentVelocity = playerBody.velocity;
      setVelocity(playerBody, {
        x: xVelocity,
        y: currentVelocity.y
      });
      
      // Handle jumping
      if (player.controls.jump && player.state.onGround && !player.state.jumping) {
        player.state.jumping = true;
        player.state.onGround = false;
        applyImpulse(playerBody, { x: 0, y: -player.jumpForce });
      }
      
      // Reset jump when landing
      if (player.state.onGround) {
        player.state.jumping = false;
        player.state.falling = false;
      } else if (currentVelocity.y > 0) {
        player.state.falling = true;
      }
      
      // Action cooldown
      if (player.state.actionCooldown > 0) {
        player.state.actionCooldown -= deltaTime;
      }
      
      // Handle action
      if (player.controls.action && player.state.actionCooldown <= 0) {
        player.state.action = true;
        player.state.actionCooldown = 500; // 500ms cooldown
        
        // Action effect would go here (e.g., breaking obstacles)
        
        setTimeout(() => {
          player.state.action = false;
        }, 200);
      }
    }
  };
  
  return { player, playerBody };
};
