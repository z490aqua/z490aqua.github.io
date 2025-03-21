export function createSpriteFromSVG(svgString: string): HTMLImageElement {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const img = new Image();
  img.src = url;
  
  // Clean up the URL when the image is loaded
  img.onload = () => URL.revokeObjectURL(url);
  
  return img;
}
