import Matter from 'matter-js';

interface Platform {
  body: Matter.Body;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Walls {
  left: Matter.Body;
  right: Matter.Body;
  top: Matter.Body;
  bottom: Matter.Body;
}

// Define level layouts
const levelDefinitions = [
  // Level 1: The Constitution
  {
    name: "The Constitution",
    description: "Learn the basics of the Legislative Branch's powers",
    platforms: [
      { x: 0.2, y: 0.8, width: 0.3, height: 0.02 },
      { x: 0.5, y: 0.6, width: 0.3, height: 0.02 },
      { x: 0.8, y: 0.4, width: 0.3, height: 0.02 },
      { x: 0.2, y: 0.4, width: 0.2, height: 0.02 },
    ],
    documentPositions: [
      { id: "constitution", x: 0.8, y: 0.3 }
    ],
    obstaclePositions: [
      { type: "veto", x: 0.5, y: 0.5 }
    ],
    playerStart: { x: 0.1, y: 0.7 },
    exitPosition: { x: 0.9, y: 0.3 }
  },
  // Level 2: Federalist No. 10
  {
    name: "Federalist No. 10",
    description: "Learn about factions and plurality of interests",
    platforms: [
      { x: 0.1, y: 0.8, width: 0.2, height: 0.02 },
      { x: 0.4, y: 0.7, width: 0.2, height: 0.02 },
      { x: 0.7, y: 0.6, width: 0.2, height: 0.02 },
      { x: 0.3, y: 0.5, width: 0.2, height: 0.02 },
      { x: 0.6, y: 0.4, width: 0.2, height: 0.02 },
      { x: 0.2, y: 0.3, width: 0.2, height: 0.02 },
    ],
    documentPositions: [
      { id: "federalist-10", x: 0.2, y: 0.2 }
    ],
    obstaclePositions: [
      { type: "decree", x: 0.4, y: 0.6 },
      { type: "veto", x: 0.7, y: 0.5 }
    ],
    playerStart: { x: 0.1, y: 0.7 },
    exitPosition: { x: 0.9, y: 0.3 }
  },
  // Level 3: Federalist No. 51
  {
    name: "Federalist No. 51",
    description: "Explore checks and balances between branches",
    platforms: [
      { x: 0.1, y: 0.8, width: 0.2, height: 0.02 },
      { x: 0.5, y: 0.7, width: 0.3, height: 0.02 },
      { x: 0.8, y: 0.6, width: 0.2, height: 0.02 },
      { x: 0.3, y: 0.5, width: 0.2, height: 0.02 },
      { x: 0.6, y: 0.4, width: 0.2, height: 0.02 },
      { x: 0.2, y: 0.3, width: 0.2, height: 0.02 },
    ],
    documentPositions: [
      { id: "federalist-51", x: 0.6, y: 0.3 }
    ],
    obstaclePositions: [
      { type: "order", x: 0.5, y: 0.6 },
      { type: "veto", x: 0.3, y: 0.4 },
      { type: "decree", x: 0.8, y: 0.5 }
    ],
    playerStart: { x: 0.1, y: 0.7 },
    exitPosition: { x: 0.9, y: 0.3 }
  },
  // Level 4: Brutus No. 1
  {
    name: "Brutus No. 1",
    description: "Understand criticisms of central government power",
    platforms: [
      { x: 0.1, y: 0.8, width: 0.2, height: 0.02 },
      { x: 0.4, y: 0.7, width: 0.2, height: 0.02 },
      { x: 0.7, y: 0.6, width: 0.2, height: 0.02 },
      { x: 0.2, y: 0.5, width: 0.2, height: 0.02 },
      { x: 0.5, y: 0.4, width: 0.2, height: 0.02 },
      { x: 0.8, y: 0.3, width: 0.2, height: 0.02 },
    ],
    documentPositions: [
      { id: "brutus-1", x: 0.8, y: 0.2 }
    ],
    obstaclePositions: [
      { type: "order", x: 0.4, y: 0.6 },
      { type: "veto", x: 0.7, y: 0.5 },
      { type: "decree", x: 0.2, y: 0.4 }
    ],
    playerStart: { x: 0.1, y: 0.7 },
    exitPosition: { x: 0.9, y: 0.2 }
  },
  // Level 5: The Articles of Confederation
  {
    name: "The Articles of Confederation",
    description: "Experience the challenges of a weak central government",
    platforms: [
      { x: 0.1, y: 0.9, width: 0.8, height: 0.02 },
      { x: 0.2, y: 0.7, width: 0.1, height: 0.02 },
      { x: 0.4, y: 0.6, width: 0.1, height: 0.02 },
      { x: 0.6, y: 0.5, width: 0.1, height: 0.02 },
      { x: 0.8, y: 0.4, width: 0.1, height: 0.02 },
    ],
    documentPositions: [
      { id: "articles", x: 0.8, y: 0.3 }
    ],
    obstaclePositions: [
      { type: "order", x: 0.3, y: 0.65 },
      { type: "veto", x: 0.5, y: 0.55 },
      { type: "decree", x: 0.7, y: 0.45 }
    ],
    playerStart: { x: 0.1, y: 0.8 },
    exitPosition: { x: 0.9, y: 0.3 }
  },
  // Level 6: The Bill of Rights
  {
    name: "The Bill of Rights",
    description: "Discover the importance of individual liberties",
    platforms: [
      { x: 0.1, y: 0.9, width: 0.2, height: 0.02 },
      { x: 0.5, y: 0.8, width: 0.2, height: 0.02 },
      { x: 0.8, y: 0.7, width: 0.2, height: 0.02 },
      { x: 0.3, y: 0.6, width: 0.2, height: 0.02 },
      { x: 0.6, y: 0.5, width: 0.2, height: 0.02 },
      { x: 0.2, y: 0.4, width: 0.2, height: 0.02 },
      { x: 0.5, y: 0.3, width: 0.2, height: 0.02 },
      { x: 0.8, y: 0.2, width: 0.2, height: 0.02 },
    ],
    documentPositions: [
      { id: "bill-of-rights", x: 0.8, y: 0.1 }
    ],
    obstaclePositions: [
      { type: "order", x: 0.3, y: 0.5 },
      { type: "veto", x: 0.6, y: 0.4 },
      { type: "decree", x: 0.5, y: 0.2 }
    ],
    playerStart: { x: 0.1, y: 0.8 },
    exitPosition: { x: 0.9, y: 0.1 }
  }
];

export const getLevelInfo = (level: number) => {
  const levelIndex = level - 1;
  if (levelIndex < 0 || levelIndex >= levelDefinitions.length) {
    return levelDefinitions[0];
  }
  return levelDefinitions[levelIndex];
};

export const loadLevel = (world: Matter.World, levelNumber: number, canvasWidth: number, canvasHeight: number) => {
  const levelIndex = levelNumber - 1;
  const levelDef = levelDefinitions[levelIndex] || levelDefinitions[0];
  
  // Create walls
  const wallThickness = 100;
  const walls = {
    left: Matter.Bodies.rectangle(-50, canvasHeight / 2, wallThickness, canvasHeight, { 
      isStatic: true,
      render: { visible: false }
    }),
    right: Matter.Bodies.rectangle(canvasWidth + 50, canvasHeight / 2, wallThickness, canvasHeight, { 
      isStatic: true,
      render: { visible: false }
    }),
    top: Matter.Bodies.rectangle(canvasWidth / 2, -50, canvasWidth, wallThickness, { 
      isStatic: true,
      render: { visible: false }
    }),
    bottom: Matter.Bodies.rectangle(canvasWidth / 2, canvasHeight + 50, canvasWidth, wallThickness, { 
      isStatic: true,
      render: { visible: false }
    })
  };
  
  Matter.World.add(world, [walls.left, walls.right, walls.top, walls.bottom]);
  
  // Create platforms
  const platforms: Platform[] = [];
  
  levelDef.platforms.forEach(platform => {
    const x = platform.x * canvasWidth;
    const y = platform.y * canvasHeight;
    const width = platform.width * canvasWidth;
    const height = platform.height * canvasHeight;
    
    const platformBody = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: '#1A2E55',
        strokeStyle: '#000',
        lineWidth: 1
      }
    });
    
    Matter.World.add(world, platformBody);
    platforms.push({
      body: platformBody,
      x,
      y,
      width,
      height
    });
  });
  
  // Create level exit
  const exitSize = 40;
  const exitX = levelDef.exitPosition.x * canvasWidth;
  const exitY = levelDef.exitPosition.y * canvasHeight;
  
  const exit = Matter.Bodies.rectangle(exitX, exitY, exitSize, exitSize, {
    isStatic: true,
    isSensor: true,
    render: {
      fillStyle: '#FFD700',
      strokeStyle: '#000',
      lineWidth: 1
    }
  });
  
  Matter.World.add(world, exit);
  
  return { platforms, walls, exit };
};
