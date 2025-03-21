import Matter from 'matter-js';

// Helper functions for physics calculations
export const isOnGround = (body: Matter.Body, threshold: number = 5): boolean => {
  const contacts = body.contacts || [];
  for (const contact of contacts) {
    const otherBody = contact.bodyA === body ? contact.bodyB : contact.bodyA;
    
    // Check if the contact is below the player
    const verticalComponent = contact.normalA.y || contact.normalB.y;
    if (verticalComponent < -0.5) {
      // Vertical distance calculation
      const bodyBottom = body.bounds.max.y;
      const otherBodyTop = otherBody.bounds.min.y;
      
      if (Math.abs(bodyBottom - otherBodyTop) < threshold) {
        return true;
      }
    }
  }
  
  return false;
};

export const applyForce = (
  body: Matter.Body, 
  force: { x: number; y: number }, 
  point?: { x: number; y: number }
) => {
  Matter.Body.applyForce(
    body,
    point || body.position,
    force
  );
};

export const applyImpulse = (
  body: Matter.Body, 
  impulse: { x: number; y: number }, 
  point?: { x: number; y: number }
) => {
  // Apply a single impulse to the body
  const mass = body.mass;
  const force = {
    x: impulse.x / (1000 / 60) * mass,
    y: impulse.y / (1000 / 60) * mass
  };
  
  Matter.Body.applyForce(
    body,
    point || body.position,
    force
  );
};

export const setVelocity = (body: Matter.Body, velocity: { x: number; y: number }) => {
  Matter.Body.setVelocity(body, velocity);
};

export const checkCollision = (bodyA: Matter.Body, bodyB: Matter.Body): boolean => {
  return Matter.SAT.collides(bodyA, bodyB).collided;
};

export const createPhysicsBody = (
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  options: Matter.IBodyDefinition = {}
): Matter.Body => {
  return Matter.Bodies.rectangle(x, y, width, height, {
    restitution: 0.1, // Bounciness
    friction: 0.05,    // Surface friction
    frictionAir: 0.01, // Air resistance
    ...options
  });
};

export const createSensor = (
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  options: Matter.IBodyDefinition = {}
): Matter.Body => {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isSensor: true,
    isStatic: true,
    ...options
  });
};

export const destroyBody = (world: Matter.World, body: Matter.Body) => {
  Matter.World.remove(world, body);
};
