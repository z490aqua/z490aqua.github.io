export interface Level {
  id: number;
  title: string;
  document: string;
  backgroundLayers: string[];
  platforms: {
    x: number;
    y: number;
    width: number;
    height: number;
    type?: string;
    isMoving?: boolean;
    moveSpeed?: number;
    moveDistance?: number;
    moveAxis?: "x" | "y";
    moveDirection?: number;
  }[];
  obstacles: {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
  }[];
  collectibles: {
    x: number;
    y: number;
    type: string;
    id: string;
  }[];
  startPosition: {
    x: number;
    y: number;
  };
  endPosition: {
    x: number;
    y: number;
  };
}

export const levels: Level[] = [
  // Level 1: The Constitution
  {
    id: 1,
    title: "The Constitution",
    document: "constitution",
    backgroundLayers: [
      "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1470&auto=format&fit=crop",
    ],
    platforms: [
      { x: 0, y: 500, width: 400, height: 20 },
      { x: 500, y: 400, width: 300, height: 20 },
      { x: 900, y: 500, width: 400, height: 20 },
      { x: 1400, y: 450, width: 300, height: 20 },
      { x: 1800, y: 500, width: 400, height: 20 },
    ],
    obstacles: [
      { x: 600, y: 355, width: 60, height: 45, type: "veto" },
      { x: 1500, y: 405, width: 60, height: 45, type: "executiveOrder" },
    ],
    collectibles: [{ x: 350, y: 400, type: "document", id: "constitution" }],
    startPosition: {
      x: 50,
      y: 400,
    },
    endPosition: {
      x: 2000,
      y: 450,
    },
  },

  // Level 2: Federalist Papers
  {
    id: 2,
    title: "Federalist No. 10 & No. 51",
    document: "federalist10",
    backgroundLayers: [
      "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1470&auto=format&fit=crop",
    ],
    platforms: [
      { x: 0, y: 500, width: 300, height: 20 },
      { x: 400, y: 450, width: 200, height: 20 },
      { x: 700, y: 400, width: 200, height: 20 },
      { x: 1000, y: 350, width: 200, height: 20 },
      { x: 1300, y: 400, width: 200, height: 20 },
      { x: 1600, y: 450, width: 200, height: 20 },
      { x: 1900, y: 500, width: 300, height: 20 },
    ],
    obstacles: [
      { x: 450, y: 405, width: 60, height: 45, type: "veto" },
      { x: 850, y: 355, width: 60, height: 45, type: "executiveOrder" },
      { x: 1150, y: 305, width: 60, height: 45, type: "presidentialDecree" },
      { x: 1450, y: 355, width: 60, height: 45, type: "veto" },
    ],
    collectibles: [
      { x: 600, y: 350, type: "document", id: "federalist10" },
      { x: 1700, y: 350, type: "document", id: "federalist51" },
    ],
    startPosition: {
      x: 50,
      y: 400,
    },
    endPosition: {
      x: 2100,
      y: 450,
    },
  },

  // Level 3: Brutus No. 1 and Declaration of Independence
  {
    id: 3,
    title: "Brutus No. 1",
    document: "brutus1",
    backgroundLayers: [
      "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1470&auto=format&fit=crop",
    ],
    platforms: [
      { x: 0, y: 500, width: 300, height: 20 },
      { x: 400, y: 500, width: 100, height: 20 },
      {
        x: 600,
        y: 400,
        width: 100,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 100,
        moveSpeed: 2,
        moveDirection: 1,
      },
      { x: 800, y: 300, width: 100, height: 20 },
      {
        x: 1000,
        y: 400,
        width: 100,
        height: 20,
        isMoving: true,
        moveAxis: "y",
        moveDistance: 50,
        moveSpeed: 1.5,
        moveDirection: 1,
      },
      { x: 1200, y: 500, width: 100, height: 20 },
      {
        x: 1400,
        y: 400,
        width: 100,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 100,
        moveSpeed: 2,
        moveDirection: -1,
      },
      { x: 1600, y: 300, width: 100, height: 20 },
      {
        x: 1800,
        y: 400,
        width: 100,
        height: 20,
        isMoving: true,
        moveAxis: "y",
        moveDistance: 80,
        moveSpeed: 2,
        moveDirection: 1,
      },
      { x: 2000, y: 500, width: 300, height: 20 },
    ],
    obstacles: [
      { x: 450, y: 455, width: 60, height: 45, type: "veto" },
      { x: 650, y: 355, width: 60, height: 45, type: "executiveOrder" },
      { x: 850, y: 255, width: 60, height: 45, type: "presidentialDecree" },
      { x: 1050, y: 355, width: 60, height: 45, type: "veto" },
      { x: 1250, y: 455, width: 60, height: 45, type: "executiveOrder" },
      { x: 1450, y: 355, width: 60, height: 45, type: "presidentialDecree" },
      { x: 1650, y: 255, width: 60, height: 45, type: "veto" },
      { x: 1850, y: 355, width: 60, height: 45, type: "executiveOrder" },
    ],
    collectibles: [
      { x: 900, y: 200, type: "document", id: "brutus1" },
      { x: 1700, y: 200, type: "document", id: "declaration" },
    ],
    startPosition: {
      x: 50,
      y: 400,
    },
    endPosition: {
      x: 2200,
      y: 450,
    },
  },

  // Level 4: Articles of Confederation
  {
    id: 4,
    title: "The Articles of Confederation",
    document: "articles",
    backgroundLayers: [
      "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1470&auto=format&fit=crop",
    ],
    platforms: [
      { x: 0, y: 500, width: 200, height: 20 },
      { x: 300, y: 500, width: 100, height: 20, type: "weak" },
      { x: 500, y: 450, width: 100, height: 20, type: "weak" },
      {
        x: 700,
        y: 400,
        width: 200,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 100,
        moveSpeed: 2,
        moveDirection: 1,
      },
      { x: 1000, y: 450, width: 100, height: 20, type: "weak" },
      { x: 1200, y: 500, width: 100, height: 20, type: "weak" },
      {
        x: 1400,
        y: 500,
        width: 200,
        height: 20,
        isMoving: true,
        moveAxis: "y",
        moveDistance: 50,
        moveSpeed: 1,
        moveDirection: 1,
      },
      { x: 1700, y: 450, width: 100, height: 20, type: "weak" },
      { x: 1900, y: 400, width: 300, height: 20 },
    ],
    obstacles: [
      { x: 750, y: 355, width: 60, height: 45, type: "presidentialDecree" },
      { x: 1450, y: 455, width: 60, height: 45, type: "veto" },
      { x: 1950, y: 355, width: 60, height: 45, type: "executiveOrder" },
    ],
    collectibles: [{ x: 800, y: 300, type: "document", id: "articles" }],
    startPosition: {
      x: 50,
      y: 400,
    },
    endPosition: {
      x: 2100,
      y: 350,
    },
  },

  // Level 5: Bill of Rights and Federalist No. 70
  {
    id: 5,
    title: "The Bill of Rights",
    document: "billrights",
    backgroundLayers: [
      "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1470&auto=format&fit=crop",
    ],
    platforms: [
      { x: 0, y: 500, width: 300, height: 20 },
      { x: 400, y: 450, width: 200, height: 20 },
      {
        x: 700,
        y: 400,
        width: 200,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 150,
        moveSpeed: 3,
        moveDirection: 1,
      },
      { x: 1000, y: 450, width: 200, height: 20 },
      {
        x: 1300,
        y: 500,
        width: 200,
        height: 20,
        isMoving: true,
        moveAxis: "y",
        moveDistance: 80,
        moveSpeed: 2,
        moveDirection: 1,
      },
      { x: 1600, y: 450, width: 200, height: 20 },
      {
        x: 1900,
        y: 400,
        width: 300,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 100,
        moveSpeed: 2,
        moveDirection: -1,
      },
    ],
    obstacles: [
      { x: 450, y: 405, width: 60, height: 45, type: "executiveOrder" },
      { x: 750, y: 355, width: 60, height: 45, type: "veto" },
      { x: 1050, y: 405, width: 60, height: 45, type: "presidentialDecree" },
      { x: 1350, y: 455, width: 60, height: 45, type: "executiveOrder" },
      { x: 1650, y: 405, width: 60, height: 45, type: "veto" },
      { x: 1950, y: 355, width: 60, height: 45, type: "presidentialDecree" },
    ],
    collectibles: [
      { x: 800, y: 300, type: "document", id: "billrights" },
      { x: 1700, y: 350, type: "document", id: "federalist70" },
    ],
    startPosition: {
      x: 50,
      y: 400,
    },
    endPosition: {
      x: 2100,
      y: 350,
    },
  },

  // Level 6: Letter from Birmingham Jail
  {
    id: 6,
    title: "Letter from Birmingham Jail",
    document: "birmingham",
    backgroundLayers: [
      "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1470&auto=format&fit=crop",
    ],
    platforms: [
      { x: 0, y: 500, width: 200, height: 20 },
      { x: 300, y: 450, width: 150, height: 20 },
      {
        x: 550,
        y: 400,
        width: 150,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 120,
        moveSpeed: 2.5,
        moveDirection: 1,
      },
      { x: 800, y: 350, width: 150, height: 20 },
      {
        x: 1050,
        y: 300,
        width: 150,
        height: 20,
        isMoving: true,
        moveAxis: "y",
        moveDistance: 70,
        moveSpeed: 2,
        moveDirection: -1,
      },
      { x: 1300, y: 350, width: 150, height: 20 },
      {
        x: 1550,
        y: 400,
        width: 150,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 100,
        moveSpeed: 2,
        moveDirection: 1,
      },
      { x: 1800, y: 450, width: 150, height: 20 },
      {
        x: 2050,
        y: 500,
        width: 200,
        height: 20,
        isMoving: true,
        moveAxis: "y",
        moveDistance: 50,
        moveSpeed: 1.5,
        moveDirection: 1,
      },
    ],
    obstacles: [
      { x: 350, y: 405, width: 60, height: 45, type: "veto" },
      { x: 600, y: 355, width: 60, height: 45, type: "executiveOrder" },
      { x: 850, y: 305, width: 60, height: 45, type: "presidentialDecree" },
      { x: 1100, y: 255, width: 60, height: 45, type: "veto" },
      { x: 1350, y: 305, width: 60, height: 45, type: "executiveOrder" },
      { x: 1600, y: 355, width: 60, height: 45, type: "presidentialDecree" },
      { x: 1850, y: 405, width: 60, height: 45, type: "veto" },
    ],
    collectibles: [{ x: 1100, y: 200, type: "document", id: "birmingham" }],
    startPosition: {
      x: 50,
      y: 400,
    },
    endPosition: {
      x: 2150,
      y: 450,
    },
  },

  // Level 7: Final Challenge - Constitutional Crisis
  {
    id: 7,
    title: "Constitutional Crisis",
    document: "constitution",
    backgroundLayers: [
      "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1632&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1470&auto=format&fit=crop",
    ],
    platforms: [
      { x: 0, y: 500, width: 150, height: 20 },
      {
        x: 250,
        y: 500,
        width: 80,
        height: 20,
        isMoving: true,
        moveAxis: "y",
        moveDistance: 100,
        moveSpeed: 2,
        moveDirection: 1,
      },
      {
        x: 400,
        y: 400,
        width: 80,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 150,
        moveSpeed: 1,
        moveDirection: 1,
      },
      { x: 650, y: 450, width: 100, height: 20 },
      {
        x: 850,
        y: 400,
        width: 80,
        height: 20,
        isMoving: true,
        moveAxis: "y",
        moveDistance: 100,
        moveSpeed: 2,
        moveDirection: 1,
      },
      { x: 1050, y: 350, width: 100, height: 20 },
      {
        x: 1250,
        y: 300,
        width: 80,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 200,
        moveSpeed: 1,
        moveDirection: 1,
      },
      { x: 1550, y: 250, width: 100, height: 20 },
      {
        x: 1750,
        y: 300,
        width: 80,
        height: 20,
        isMoving: true,
        moveAxis: "y",
        moveDistance: 150,
        moveSpeed: 2,
        moveDirection: 1,
      },
      {
        x: 1950,
        y: 350,
        width: 80,
        height: 20,
        isMoving: true,
        moveAxis: "x",
        moveDistance: 150,
        moveSpeed: 1,
        moveDirection: 1,
      },
      { x: 2200, y: 400, width: 150, height: 20 },
    ],
    obstacles: [
      { x: 300, y: 400, width: 60, height: 45, type: "veto" },
      { x: 550, y: 355, width: 60, height: 45, type: "executiveOrder" },
      { x: 750, y: 405, width: 60, height: 45, type: "presidentialDecree" },
      { x: 950, y: 305, width: 60, height: 45, type: "veto" },
      { x: 1150, y: 255, width: 60, height: 45, type: "executiveOrder" },
      { x: 1350, y: 205, width: 60, height: 45, type: "presidentialDecree" },
      { x: 1650, y: 205, width: 60, height: 45, type: "veto" },
      { x: 1850, y: 255, width: 60, height: 45, type: "executiveOrder" },
      { x: 2050, y: 305, width: 60, height: 45, type: "presidentialDecree" },
    ],
    collectibles: [],
    startPosition: {
      x: 50,
      y: 400,
    },
    endPosition: {
      x: 2250,
      y: 350,
    },
  },
];
