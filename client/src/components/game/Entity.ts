export class Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  render(
    ctx: CanvasRenderingContext2D,
    offsetX: number = 0,
    offsetY: number = 0,
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x + offsetX, this.y + offsetY, this.width, this.height);
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y + 5, // Shift collision box down
      width: this.width,
      height: this.height + 5, // Reduce height to match
    };
  }
}
