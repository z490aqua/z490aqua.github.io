import { Entity } from './Entity';
import { getObstacleSVG } from '@/assets/svgs/obstacles';

// Destruction animation frames
interface DestructionParticle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  color: string;
}

export class Obstacle extends Entity {
  type: string;
  isDestroyed: boolean;
  isBeingDestroyed: boolean;
  destructionTimer: number;
  particles: DestructionParticle[];
  sprite: HTMLImageElement | null;
  pulseIntensity: number;
  pulseDirection: number;
  pulseSpeed: number;
  
  constructor(x: number, y: number, width: number, height: number, type: string) {
    super(x, y, width, height);
    this.type = type;
    this.isDestroyed = false;
    this.isBeingDestroyed = false;
    this.destructionTimer = 0;
    this.particles = [];
    this.sprite = null;
    this.pulseIntensity = 0;
    this.pulseDirection = 0.05;
    this.pulseSpeed = 0.5 + Math.random() * 0.5; // Random pulse speed for variety
    
    // Create sprite from SVG
    this.createSpriteFromSVG();
  }
  
  createSpriteFromSVG() {
    const svgString = getObstacleSVG(this.type);
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
    // Update pulse effect for active obstacles
    if (!this.isDestroyed && !this.isBeingDestroyed) {
      this.pulseIntensity += this.pulseDirection * this.pulseSpeed;
      if (this.pulseIntensity > 0.3 || this.pulseIntensity < 0) {
        this.pulseDirection *= -1;
      }
    }
    
    // Update destruction animation
    if (this.isBeingDestroyed) {
      this.destructionTimer++;
      
      // Create particles at the beginning of destruction
      if (this.destructionTimer === 1) {
        this.createDestructionParticles();
      }
      
      // Update existing particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        
        // Apply gravity and velocity
        particle.vy += 0.2;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.alpha -= 0.01;
        
        // Remove faded particles
        if (particle.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
      
      // Mark as fully destroyed when animation completes
      if (this.destructionTimer > 60) { // 1 second at 60fps
        this.isDestroyed = true;
      }
    }
  }
  
  destroy() {
    // Start destruction animation
    if (!this.isBeingDestroyed && !this.isDestroyed) {
      this.isBeingDestroyed = true;
      this.destructionTimer = 0;
    }
  }
  
  createDestructionParticles() {
    // Get the color based on obstacle type
    let color = '#8B0000'; // Default red
    switch (this.type) {
      case 'veto':
        color = '#8B0000'; // Dark red
        break;
      case 'executiveOrder':
        color = '#00008B'; // Dark blue
        break;
      case 'presidentialDecree':
        color = '#2F4F4F'; // Dark slate gray
        break;
    }
    
    // Create 20-30 particles
    const particleCount = 20 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < particleCount; i++) {
      // Random position within obstacle
      const x = this.x + Math.random() * this.width;
      const y = this.y + Math.random() * this.height;
      
      // Random velocity (explosion effect)
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 2; // Initial upward velocity
      
      // Random size
      const size = 2 + Math.random() * 6;
      
      // Random rotation
      const rotation = Math.random() * Math.PI * 2;
      const rotationSpeed = -0.1 + Math.random() * 0.2;
      
      this.particles.push({
        x, y, size, vx, vy, rotation, rotationSpeed,
        alpha: 0.8 + Math.random() * 0.2,
        color
      });
    }
  }
  
  render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0) {
    if (this.isDestroyed) return;
    
    // Update obstacle state
    this.update();
    
    if (this.isBeingDestroyed) {
      // Render destruction particles
      this.renderDestructionParticles(ctx, offsetX, offsetY);
      return;
    }
    
    // Render active obstacle
    if (this.sprite) {
      this.renderWithSprite(ctx, offsetX, offsetY);
    } else {
      this.renderFallback(ctx, offsetX, offsetY);
    }
  }
  
  private renderWithSprite(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
    // Skip if sprite is null
    if (!this.sprite) return;
    
    // Save context for transformations
    ctx.save();
    
    // Draw base sprite
    ctx.drawImage(
      this.sprite, 
      this.x + offsetX, 
      this.y + offsetY, 
      this.width, 
      this.height
    );
    
    // Add pulsing effect
    if (this.pulseIntensity > 0) {
      // Draw glowing outline
      ctx.globalAlpha = this.pulseIntensity;
      ctx.filter = 'blur(4px)';
      
      // Get color based on obstacle type
      switch (this.type) {
        case 'veto':
          ctx.fillStyle = 'rgba(139, 0, 0, 0.7)'; // Dark red
          break;
        case 'executiveOrder':
          ctx.fillStyle = 'rgba(0, 0, 139, 0.7)'; // Dark blue
          break;
        case 'presidentialDecree':
          ctx.fillStyle = 'rgba(47, 79, 79, 0.7)'; // Dark slate gray
          break;
        default:
          ctx.fillStyle = 'rgba(75, 0, 130, 0.7)'; // Indigo
      }
      
      // Draw glow around obstacle
      ctx.fillRect(
        this.x - 5 + offsetX,
        this.y - 5 + offsetY,
        this.width + 10,
        this.height + 10
      );
      
      // Reset alpha and filter
      ctx.globalAlpha = 1;
      ctx.filter = 'none';
    }
    
    ctx.restore();
  }
  
  private renderFallback(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
    ctx.save();
    
    // Get color based on obstacle type
    switch (this.type) {
      case 'veto':
        ctx.fillStyle = '#8B0000'; // Dark red
        break;
      case 'executiveOrder':
        ctx.fillStyle = '#00008B'; // Dark blue
        break;
      case 'presidentialDecree':
        ctx.fillStyle = '#2F4F4F'; // Dark slate gray
        break;
      default:
        ctx.fillStyle = '#4B0082'; // Indigo
    }
    
    // Draw base rectangle
    ctx.fillRect(this.x + offsetX, this.y + offsetY, this.width, this.height);
    
    // Add pulsing outline
    if (this.pulseIntensity > 0) {
      ctx.globalAlpha = this.pulseIntensity;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.x + offsetX - 1,
        this.y + offsetY - 1,
        this.width + 2,
        this.height + 2
      );
      ctx.globalAlpha = 1;
    }
    
    // Add an icon or label
    ctx.fillStyle = '#F0F0E8'; // Off-white
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    let label = '!';
    switch (this.type) {
      case 'veto':
        label = 'VETO';
        break;
      case 'executiveOrder':
        label = 'EO';
        break;
      case 'presidentialDecree':
        label = 'PD';
        break;
    }
    
    ctx.fillText(
      label, 
      this.x + this.width / 2 + offsetX, 
      this.y + this.height / 2 + 4 + offsetY
    );
    
    ctx.restore();
  }
  
  private renderDestructionParticles(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
    ctx.save();
    
    // Render each particle
    for (const particle of this.particles) {
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      
      ctx.translate(
        particle.x + offsetX,
        particle.y + offsetY
      );
      ctx.rotate(particle.rotation);
      
      // Draw particle (square or rectangle)
      ctx.fillRect(
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size
      );
      
      // Reset transformation
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    ctx.restore();
  }
}
