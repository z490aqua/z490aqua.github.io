export class Background {
  layers: { image: HTMLImageElement; scrollFactor: number }[];
  width: number;
  height: number;
  
  // Use single stylized wilderness background
  static WildernessBackgrounds = [
    "https://t4.ftcdn.net/jpg/10/05/45/27/240_F_1005452796_FjOYpjULs0Si9153fxqViWyqTzrVZvDD.jpg" // Stylized cartoonish wilderness
  ];
  
  constructor(layerUrls: string[], width: number, height: number) {
    this.width = width;
    this.height = height;
    this.layers = [];
    
    // Always use wilderness backgrounds
    const backgrounds = Background.WildernessBackgrounds;
    
    // Create layers with different scroll factors for parallax effect
    backgrounds.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      
      // Assign increasing scroll factors for deeper parallax effect
      // Background layers (higher index) scroll slower than foreground layers
      const scrollFactor = 0.05 + (index * 0.15); // This creates a more subtle, graduated effect
      
      this.layers.push({
        image: img,
        scrollFactor
      });
    });
  }
  
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  
  render(ctx: CanvasRenderingContext2D, cameraX: number) {
    // We're only working with a single background image now
    if (this.layers.length > 0) {
      const layer = this.layers[0];
      
      // Calculate a subtle parallax offset for the single background
      const parallaxOffset = cameraX * 0.05; // Very subtle movement
      
      // Set full opacity for the background
      ctx.globalAlpha = 1.0;
      
      // Draw the background image to cover the entire canvas
      // Using the parallax offset for a subtle movement effect
      if (layer.image.complete) {
        // Calculate how many times to tile the image horizontally
        const imageRatio = layer.image.width / layer.image.height;
        const drawHeight = this.height;
        const drawWidth = drawHeight * imageRatio;
        
        // Calculate how many tiles we need to cover the screen
        const tilesNeeded = Math.ceil(this.width / drawWidth) + 1;
        
        // Calculate the starting position with parallax effect
        const offsetX = -(parallaxOffset % drawWidth);
        
        // Draw the repeating background
        for (let i = 0; i < tilesNeeded; i++) {
          const x = offsetX + (i * drawWidth);
          ctx.drawImage(layer.image, x, 0, drawWidth, drawHeight);
        }
      }
    }
    
    // Reset alpha for other rendering
    ctx.globalAlpha = 1;
  }
}
