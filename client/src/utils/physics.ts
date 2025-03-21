import { Entity } from '@/components/game/Entity';

interface CollisionResult {
  collided: boolean;
  direction: 'top' | 'bottom' | 'left' | 'right' | null;
}

export function checkCollision(entity1: Entity, entity2: Entity): CollisionResult {
  // Get the bounds of both entities
  const bounds1 = entity1.getBounds();
  const bounds2 = entity2.getBounds();
  
  // Check if there's any overlap
  const isOverlapping = 
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y;
  
  if (!isOverlapping) {
    return { collided: false, direction: null };
  }
  
  // Calculate previous position (before the collision)
  const prevBottom = entity1.y + entity1.height - entity1.velocityY;
  const prevTop = entity1.y - entity1.velocityY;
  const prevLeft = entity1.x - entity1.velocityX;
  const prevRight = entity1.x + entity1.width - entity1.velocityX;
  
  // Check if entity was previously above the platform
  const wasAbove = prevBottom <= bounds2.y;
  
  // Check if entity was previously below the platform
  const wasBelow = prevTop >= bounds2.y + bounds2.height;
  
  // Check if entity was previously to the left of the platform
  const wasLeft = prevRight <= bounds2.x;
  
  // Check if entity was previously to the right of the platform
  const wasRight = prevLeft >= bounds2.x + bounds2.width;
  
  // Prioritize bottom collision for accurate floor detection
  const bottomCollisionThreshold = Math.abs(entity1.velocityY) + 2; // Small threshold to help with detection
  
  // Determine collision direction based on previous position and velocity
  let direction: 'top' | 'bottom' | 'left' | 'right' | null = null;
  
  // Fast falling - prioritize collision from below
  if (entity1.velocityY > 0 && wasAbove) {
    direction = 'bottom';
  } 
  // Fast moving up - prioritize collision from above
  else if (entity1.velocityY < 0 && wasBelow) {
    direction = 'top';
  }
  // Fast moving right - prioritize collision from the left
  else if (entity1.velocityX > 0 && wasLeft) {
    direction = 'left';
  }
  // Fast moving left - prioritize collision from the right
  else if (entity1.velocityX < 0 && wasRight) {
    direction = 'right';
  }
  // Determine based on the smallest overlap
  else {
    // Calculate overlap on each axis
    const overlapX = Math.min(
      bounds1.x + bounds1.width - bounds2.x,
      bounds2.x + bounds2.width - bounds1.x
    );
    
    const overlapY = Math.min(
      bounds1.y + bounds1.height - bounds2.y,
      bounds2.y + bounds2.height - bounds1.y
    );
    
    // For platformers, slightly favor vertical collisions for better gameplay
    const scaledOverlapX = overlapX * 1.1; 
    
    if (scaledOverlapX < overlapY) {
      // Collision is horizontal
      if (bounds1.x < bounds2.x) {
        direction = 'left'; // entity1 is to the left of entity2
      } else {
        direction = 'right'; // entity1 is to the right of entity2
      }
    } else {
      // Collision is vertical
      if (bounds1.y < bounds2.y) {
        direction = 'top'; // entity1 is above entity2
      } else {
        direction = 'bottom'; // entity1 is below entity2
      }
    }
  }
  
  return { collided: true, direction };
}

export function isOnGround(entity: Entity, platforms: Entity[]): boolean {
  for (const platform of platforms) {
    const entityBottom = entity.y + entity.height;
    const platformTop = platform.y;
    const entityLeft = entity.x;
    const entityRight = entity.x + entity.width;
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;
    
    // Strict ground detection - entity must be exactly on or slightly above platform
    if (
      entityBottom <= platformTop + 1 &&
      entityBottom >= platformTop - 1 &&
      entityRight > platformLeft &&
      entityLeft < platformRight
    ) {
      entity.y = platformTop - entity.height; // Snap to platform
      return true;
    }
  }
  
  return false;
}
