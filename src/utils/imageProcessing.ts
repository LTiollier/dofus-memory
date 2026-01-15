export const getPixelDiff = (data1: Uint8ClampedArray, data2: Uint8ClampedArray): number => {
  let diff = 0;
  for (let i = 0; i < data1.length; i += 4) {
    diff += Math.abs(data1[i] - data2[i]);     // R
    diff += Math.abs(data1[i+1] - data2[i+1]); // G
    diff += Math.abs(data1[i+2] - data2[i+2]); // B
  }
  return diff / (data1.length / 4); // Average difference per pixel
};

export const cropImage = (
    video: HTMLVideoElement, 
    x: number, 
    y: number, 
    w: number, 
    h: number
): string => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Draw only the specific region
    ctx.drawImage(video, x, y, w, h, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', 0.8);
};
