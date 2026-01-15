// src/utils/monsterMatcher.ts

export interface MonsterAsset {
  id: string;
  category: 'biblop' | 'blop' | 'royal_blop';
  url: string;
}

export const MONSTERS: MonsterAsset[] = [
  // Biblops
  { id: '166', category: 'biblop', url: '/biblops/166.webp' },
  { id: '167', category: 'biblop', url: '/biblops/167.webp' },
  { id: '168', category: 'biblop', url: '/biblops/168.webp' },
  { id: '169', category: 'biblop', url: '/biblops/169.webp' },
  // Blops
  { id: '162', category: 'blop', url: '/blops/162.webp' },
  { id: '163', category: 'blop', url: '/blops/163.webp' },
  { id: '164', category: 'blop', url: '/blops/164.webp' },
  { id: '165', category: 'blop', url: '/blops/165.webp' },
  // Royal Blops
  { id: '645', category: 'royal_blop', url: '/royal_blops/645.webp' },
  { id: '646', category: 'royal_blop', url: '/royal_blops/646.webp' },
  { id: '647', category: 'royal_blop', url: '/royal_blops/647.webp' },
  { id: '648', category: 'royal_blop', url: '/royal_blops/648.webp' },
];

interface LoadedReference {
  asset: MonsterAsset;
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

// Standard size for comparison to normalize scaling differences
const COMPARE_SIZE = 64; 

export class MonsterMatcher {
  private references: LoadedReference[] = [];
  private isLoaded = false;

  async loadAssets() {
    if (this.isLoaded) return;

    const promises = MONSTERS.map(async (monster) => {
      return new Promise<LoadedReference | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = monster.url;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = COMPARE_SIZE;
          canvas.height = COMPARE_SIZE;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            resolve(null);
            return;
          }
          // Draw image resized to standard size
          ctx.drawImage(img, 0, 0, COMPARE_SIZE, COMPARE_SIZE);
          const data = ctx.getImageData(0, 0, COMPARE_SIZE, COMPARE_SIZE).data;
          resolve({
            asset: monster,
            data,
            width: COMPARE_SIZE,
            height: COMPARE_SIZE
          });
        };
        img.onerror = () => {
            console.error(`Failed to load asset: ${monster.url}`);
            resolve(null);
        };
      });
    });

    const results = await Promise.all(promises);
    this.references = results.filter((r): r is LoadedReference => r !== null);
    this.isLoaded = true;
    console.log(`Loaded ${this.references.length} monster references.`);
  }

  findMatch(
    source: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number
  ): MonsterAsset | null {
    if (!this.isLoaded || this.references.length === 0) return null;

    // Create a temporary canvas to resize the captured source to COMPARE_SIZE
    const canvas = document.createElement('canvas');
    canvas.width = COMPARE_SIZE;
    canvas.height = COMPARE_SIZE;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(source, sx, sy, sw, sh, 0, 0, COMPARE_SIZE, COMPARE_SIZE);
    const capturedData = ctx.getImageData(0, 0, COMPARE_SIZE, COMPARE_SIZE).data;

    let bestMatch: MonsterAsset | null = null;
    let minDiff = Number.MAX_VALUE;

    // Threshold: Average pixel difference.
    // 0 = identical. 255 = completely opposite.
    // Since we ignore transparency in reference, we focus on the shape.
    // A value of 40-50 is usually a good starting point for loose matching.
    const MATCH_THRESHOLD = 65; 

    for (const ref of this.references) {
      const diff = this.calculateDifference(capturedData, ref.data);
      if (diff < minDiff) {
        minDiff = diff;
        bestMatch = ref.asset;
      }
    }

    // console.log(`Best match: ${bestMatch?.id} with diff: ${minDiff.toFixed(2)}`);

    if (minDiff <= MATCH_THRESHOLD) {
      return bestMatch;
    }

    return null;
  }

  private calculateDifference(
    captured: Uint8ClampedArray,
    reference: Uint8ClampedArray
  ): number {
    let totalDiff = 0;
    let pixelsCompared = 0;

    for (let i = 0; i < reference.length; i += 4) {
      const refAlpha = reference[i + 3];

      // Only compare if reference pixel is not fully transparent
      // We can use a threshold for partial transparency too (e.g. > 50)
      if (refAlpha > 50) {
        const rDiff = Math.abs(captured[i] - reference[i]);
        const gDiff = Math.abs(captured[i + 1] - reference[i + 1]);
        const bDiff = Math.abs(captured[i + 2] - reference[i + 2]);
        
        totalDiff += (rDiff + gDiff + bDiff) / 3;
        pixelsCompared++;
      }
    }

    if (pixelsCompared === 0) return 255; // Should not happen for valid images

    return totalDiff / pixelsCompared;
  }
}

// Singleton instance
export const monsterMatcher = new MonsterMatcher();
