import Matter from 'matter-js';
import { checkCollision } from './physics';

export type ObstacleType = 'veto' | 'order' | 'decree';

interface Obstacle {
  body: Matter.Body;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  strength: number;
  broken: boolean;
  update: (playerBody: Matter.Body, deltaTime: number) => void;
}

// Obstacle factory function
export const createObstacle = (
  world: Matter.World,
  type: ObstacleType,
  x: number,
  y: number,
  width: number,
  height: number
): Obstacle => {
  // Obstacle properties based on type
  const properties = {
    veto: {
      strength: 3,
      color: '#003366',
      name: 'Veto Shield'
    },
    order: {
      strength: 2,
      color: '#660000',
      name: 'Executive Order'
    },
    decree: {
      strength: 1,
      color: '#006600',
      name: 'Presidential Decree'
    }
  };
  
  // Create obstacle body
  const body = Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: {
      fillStyle: properties[type].color,
      strokeStyle: '#000',
      lineWidth: 2
    }
  });
  
  // Add obstacle to world
  Matter.World.add(world, body);
  
  const obstacle: Obstacle = {
    body,
    type,
    x,
    y,
    width,
    height,
    strength: properties[type].strength,
    broken: false,
    update: (playerBody: Matter.Body, deltaTime: number) => {
      if (obstacle.broken) return;
      
      // Check for collision with player
      if (checkCollision(playerBody, body)) {
        // If player has the right power-up, reduce obstacle strength
        // For demonstration purposes, we'll just break the obstacle on collision
        // In a full implementation, this would check for specific power-ups
        obstacle.strength -= 1;
        
        if (obstacle.strength <= 0) {
          obstacle.broken = true;
          Matter.World.remove(world, body);
        }
      }
    }
  };
  
  return obstacle;
};

// Create obstacles for a level
export const createObstacles = (
  world: Matter.World,
  level: number,
  canvasWidth: number,
  canvasHeight: number
): Obstacle[] => {
  const obstacles: Obstacle[] = [];
  
  // Define obstacle positions based on level
  const obstacleLayouts = [
    // Level 1
    [
      { type: 'veto', x: 0.5, y: 0.5 }
    ],
    // Level 2
    [
      { type: 'veto', x: 0.4, y: 0.6 },
      { type: 'decree', x: 0.7, y: 0.5 }
    ],
    // Level 3
    [
      { type: 'order', x: 0.5, y: 0.6 },
      { type: 'veto', x: 0.3, y: 0.4 },
      { type: 'decree', x: 0.8, y: 0.5 }
    ],
    // Level 4
    [
      { type: 'order', x: 0.4, y: 0.6 },
      { type: 'veto', x: 0.7, y: 0.5 },
      { type: 'decree', x: 0.2, y: 0.4 }
    ],
    // Level 5
    [
      { type: 'order', x: 0.3, y: 0.65 },
      { type: 'veto', x: 0.5, y: 0.55 },
      { type: 'decree', x: 0.7, y: 0.45 }
    ],
    // Level 6
    [
      { type: 'order', x: 0.3, y: 0.5 },
      { type: 'veto', x: 0.6, y: 0.4 },
      { type: 'decree', x: 0.5, y: 0.2 }
    ]
  ];
  
  const currentLevelObstacles = obstacleLayouts[level - 1] || obstacleLayouts[0];
  
  currentLevelObstacles.forEach(obstacleConfig => {
    const x = obstacleConfig.x * canvasWidth;
    const y = obstacleConfig.y * canvasHeight;
    const width = 40;
    const height = 40;
    
    const obstacle = createObstacle(
      world,
      obstacleConfig.type as ObstacleType,
      x,
      y,
      width,
      height
    );
    
    obstacles.push(obstacle);
  });
  
  return obstacles;
};
