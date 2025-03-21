import { Entity } from './Entity';
import { getDocumentSVG } from '@/assets/svgs/documents';

export class Collectible extends Entity {
  type: string;
  id: string;
  sprite: HTMLImageElement | null;
  floatOffset: number;
  floatDirection: number;
  rotation: number;
  pulseScale: number;
  pulseDirection: number;
  glowIntensity: number;
  glowDirection: number;
  
  constructor(x: number, y: number, width: number, height: number, type: string, id: string) {
    super(x, y, width, height);
    this.type = type;
    this.id = id;
    this.sprite = null;
    
    // Animation properties
    this.floatOffset = 0;
    this.floatDirection = 1;
    this.rotation = 0;
    this.pulseScale = 1.0;
    this.pulseDirection = 0.005;
    this.glowIntensity = 0.3;
    this.glowDirection = 0.01;
    
    // Create sprite from SVG
    this.createSpriteFromSVG();
  }
  
  createSpriteFromSVG() {
    const svgString = getDocumentSVG(this.id);
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
    // Make the collectible float up and down with smooth sine wave motion
    this.floatOffset = Math.sin(Date.now() / 500) * 5;
    
    // Gentle rotation effect
    this.rotation = Math.sin(Date.now() / 2000) * 0.1;
    
    // Pulse scaling effect
    this.pulseScale += this.pulseDirection;
    if (this.pulseScale > 1.05 || this.pulseScale < 0.95) {
      this.pulseDirection *= -1;
    }
    
    // Glow effect that pulses
    this.glowIntensity += this.glowDirection;
    if (this.glowIntensity > 0.4 || this.glowIntensity < 0.2) {
      this.glowDirection *= -1;
    }
  }
  
  render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0) {
    if (!this.sprite) {
      this.renderFallback(ctx, offsetX, offsetY);
      return;
    }
    
    // Save the context state for transformations
    ctx.save();
    
    // Set the pivot point to the center of the collectible
    const centerX = this.x + offsetX + this.width / 2;
    const centerY = this.y + offsetY + this.height / 2 + this.floatOffset;
    
    // Translate to center, apply transforms, then translate back
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);
    ctx.scale(this.pulseScale, this.pulseScale);
    
    // Draw glow effect first (behind the sprite)
    ctx.globalAlpha = this.glowIntensity;
    ctx.filter = 'blur(6px)';
    ctx.drawImage(
      this.sprite,
      -this.width / 2 - 10,
      -this.height / 2 - 10,
      this.width + 20,
      this.height + 20
    );
    
    // Reset for main sprite
    ctx.filter = 'none';
    ctx.globalAlpha = 1.0;
    
    // Draw the actual collectible sprite
    ctx.drawImage(
      this.sprite,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    
    // Restore the context state
    ctx.restore();
    
    // Draw a hint circle underneath (optional)
    this.drawHintCircle(ctx, centerX, centerY + this.height / 2);
  }
  
  private drawHintCircle(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Draw a pulsing circle below the collectible to hint importance
    const radius = 15 + Math.sin(Date.now() / 300) * 5;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    
    // Create a radial gradient for the circle
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(245, 240, 220, 0.7)');
    gradient.addColorStop(1, 'rgba(245, 240, 220, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }
  
  private renderFallback(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
    // Fallback to a colored rectangle if sprite is not loaded
    ctx.save();
    
    // Apply floating effect
    const drawY = this.y + offsetY + this.floatOffset;
    
    // Draw parchment
    ctx.fillStyle = '#F5F0DC'; // Parchment color
    ctx.fillRect(this.x + offsetX, drawY, this.width, this.height);
    
    // Draw document lines
    ctx.fillStyle = '#B22234'; // Vintage red
    ctx.fillRect(this.x + 5 + offsetX, drawY + 5, this.width - 10, 2);
    ctx.fillRect(this.x + 5 + offsetX, drawY + 10, this.width - 10, 2);
    ctx.fillRect(this.x + 5 + offsetX, drawY + 15, this.width - 20, 2);
    ctx.fillRect(this.x + 5 + offsetX, drawY + 20, this.width - 15, 2);
    
    // Draw a hint circle underneath
    this.drawHintCircle(
      ctx, 
      this.x + offsetX + this.width / 2, 
      drawY + this.height
    );
    
    ctx.restore();
  }
}
