import { Entity } from './Entity';

export class Platform extends Entity {
  type: string;
  private pattern: CanvasPattern | null = null;
  private gradientColors: { top: string, middle: string, bottom: string };
  
  // Movement properties
  isMoving: boolean = false;
  moveAxis: 'x' | 'y' = 'x';
  moveDistance: number = 0;
  moveSpeed: number = 0;
  moveDirection: number = 1;
  initialX: number;
  initialY: number;
  
  // Visual effect properties for moving platforms
  pulseEffect: number = 0;
  
  constructor(x: number, y: number, width: number, height: number, type: string = 'normal', platformData?: any) {
    super(x, y, width, height);
    this.type = type;
    this.initialX = x;
    this.initialY = y;
    
    // Initialize movement if provided
    if (platformData) {
      this.isMoving = platformData.isMoving || false;
      this.moveAxis = platformData.moveAxis || 'x';
      this.moveDistance = platformData.moveDistance || 0;
      this.moveSpeed = platformData.moveSpeed || 0;
      this.moveDirection = platformData.moveDirection || 1;
    }
    
    // Set platform colors based on type
    if (this.type === 'normal') {
      if (this.isMoving) {
        // Bright orange color for moving platforms (more vibrant)
        this.gradientColors = {
          top: '#FFB366',    // Lighter orange
          middle: '#FF8000', // Bright orange
          bottom: '#E65C00'  // Dark orange
        };
      } else {
        this.gradientColors = {
          top: '#284D7E',    // Top highlight
          middle: '#1A2E55', // Main color (Navy blue)
          bottom: '#0F1A33'  // Bottom shadow
        };
      }
    } else if (this.type === 'weak') {
      this.gradientColors = {
        top: '#89AEDE',    // Top highlight
        middle: '#6C8EBF', // Main color (Lighter blue)
        bottom: '#4F6A8F'  // Bottom shadow
      };
    } else {
      this.gradientColors = {
        top: '#5A89BD',    // Top highlight
        middle: '#3A5E8C', // Main color (Medium blue)
        bottom: '#27405F'  // Bottom shadow
      };
    }
  }
  
  // Creates a texture pattern for the platform
  private createPattern(ctx: CanvasRenderingContext2D): CanvasPattern | null {
    try {
      // Create a small canvas for the pattern
      const patternCanvas = document.createElement('canvas');
      const patternCtx = patternCanvas.getContext('2d');
      
      if (!patternCtx) return null;
      
      // Set pattern size
      patternCanvas.width = 8;
      patternCanvas.height = 8;
      
      // Draw pattern (subtle grid or texture)
      patternCtx.fillStyle = this.gradientColors.middle;
      patternCtx.fillRect(0, 0, 8, 8);
      
      // Add subtle texture details
      patternCtx.fillStyle = `rgba(255, 255, 255, 0.1)`;
      patternCtx.fillRect(0, 0, 4, 4);
      patternCtx.fillRect(4, 4, 4, 4);
      
      // Create and return the pattern
      return ctx.createPattern(patternCanvas, 'repeat');
    } catch (e) {
      console.error('Error creating platform pattern:', e);
      return null;
    }
  }
  
  update() {
    if (this.isMoving) {
      // Calculate movement based on sine wave for smooth back-and-forth motion
      if (this.moveAxis === 'x') {
        this.x = this.initialX + Math.sin(Date.now() * 0.001 * this.moveSpeed) * this.moveDistance * this.moveDirection;
      } else if (this.moveAxis === 'y') {
        this.y = this.initialY + Math.sin(Date.now() * 0.001 * this.moveSpeed) * this.moveDistance * this.moveDirection;
      }
      
      // Update pulse effect (faster than movement for visual distinction)
      const pulseSpeed = 4.0;
      this.pulseEffect = (Math.sin(Date.now() * 0.003 * pulseSpeed) + 1) * 0.5; // Value between 0 and 1
    }
  }
  
  render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0) {
    // Save context for transformations
    ctx.save();
    
    // Calculate visible area for optimization
    const screenLeft = -offsetX;
    const screenRight = -offsetX + ctx.canvas.width;
    const screenTop = -offsetY;
    const screenBottom = -offsetY + ctx.canvas.height;
    
    // Skip rendering if platform is completely off-screen
    if (this.x > screenRight || 
        this.x + this.width < screenLeft || 
        this.y > screenBottom || 
        this.y + this.height < screenTop) {
      ctx.restore();
      return;
    }
    
    // Create pattern if not already created
    if (!this.pattern) {
      this.pattern = this.createPattern(ctx);
    }
    
    // Calculate drawing position
    const drawX = this.x + offsetX;
    const drawY = this.y + offsetY;
    
    // Create gradient for 3D effect
    const gradient = ctx.createLinearGradient(
      drawX, drawY, 
      drawX, drawY + this.height
    );
    gradient.addColorStop(0, this.gradientColors.top);
    gradient.addColorStop(0.5, this.gradientColors.middle);
    gradient.addColorStop(1, this.gradientColors.bottom);
    
    // Draw main platform shape with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(drawX, drawY, this.width, this.height);
    
    // Apply pattern overlay if available
    if (this.pattern) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = this.pattern;
      ctx.fillRect(drawX, drawY, this.width, this.height);
      ctx.globalAlpha = 1.0;
    }
    
    // Add a subtle top highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(drawX, drawY, this.width, 2);
    
    // Add platform edge details
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(drawX, drawY + this.height - 2, this.width, 2);
    
    // Add a subtle right edge shadow 
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(drawX + this.width - 2, drawY, 2, this.height);
    
    // Add pulsing glow effect for moving platforms
    if (this.isMoving) {
      // Varying opacity based on pulse effect
      const glowOpacity = 0.3 + (this.pulseEffect * 0.4); // Range from 0.3 to 0.7
      ctx.strokeStyle = `rgba(255, 215, 0, ${glowOpacity})`;
      ctx.lineWidth = 2 + (this.pulseEffect * 2); // Width varies between 2-4px
      ctx.strokeRect(drawX - 2, drawY - 2, this.width + 4, this.height + 4);
      
      // Add an inner glow
      ctx.fillStyle = `rgba(255, 215, 0, ${this.pulseEffect * 0.2})`;
      ctx.fillRect(drawX, drawY, this.width, this.height);
    }
    
    // Add optional platform type indicators
    if (this.type === 'weak') {
      // Draw cracks or warning pattern for weak platforms
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      
      // Draw zigzag cracks
      ctx.beginPath();
      for (let i = 0; i < this.width; i += this.width / 4) {
        const startX = drawX + i;
        ctx.moveTo(startX, drawY + 5);
        ctx.lineTo(startX + 10, drawY + this.height - 5);
        ctx.moveTo(startX + 5, drawY + 5);
        ctx.lineTo(startX - 5, drawY + this.height - 5);
      }
      ctx.stroke();
    }
    
    // Restore context state
    ctx.restore();
  }
}
